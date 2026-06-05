"""
================================================================================
BA Airline — Merged Analysis (ss2 + ss3 → ss5)
================================================================================
9 unique analysis directions:
  From ss2:
    1. Verified vs Unverified Reviews
    2. Value for Money as Key Satisfaction Driver
    3. Review Length vs Rating (Negative Bias Effect)
    4. Yearly Service Quality Trends
    5. Service Weak-Link Analysis
    6. Recommendation Classification (Binary Prediction)
  From ss3 (1.md extensions):
    7. Cabin Service Sensitivity Difference (Ext 1)
    8. Rating-Recommendation Inconsistency (Ext 2 — Dual Model + Anomalies)
    9. Low-score Root Cause & Improvement Priority (Ext 3 — Keyword Matching)
================================================================================
"""
import os
import re
import pandas as pd
import numpy as np
import warnings
warnings.filterwarnings('ignore')

os.makedirs('./data', exist_ok=True)

# ===========================================================================
# PHASE 0: DATA PREPROCESSING (adopting ss3's fill strategy)
# ===========================================================================
print("=" * 70)
print("PHASE 0: Data Preprocessing")
print("=" * 70)

pdf = pd.read_csv('BA_AirlineReviews.csv', encoding='latin-1')
print(f"Raw data: {pdf.shape}")

# Drop useless columns
drop_cols = ['Unnamed: 0', 'Wifi&Connectivity']
pdf = pdf.drop(columns=[c for c in drop_cols if c in pdf.columns])

# Fill numeric with median (ss3 strategy — preserves more rows)
num_cols = ['OverallRating', 'SeatComfort', 'CabinStaffService',
            'GroundService', 'ValueForMoney', 'Food&Beverages', 'InflightEntertainment']
for c in num_cols:
    pdf[c] = pdf[c].fillna(pdf[c].median())

# Fill categorical with mode
cat_cols = ['TypeOfTraveller', 'SeatType', 'Route', 'DateFlown', 'Aircraft']
for c in cat_cols:
    pdf[c] = pdf[c].fillna(pdf[c].mode()[0] if not pdf[c].mode().empty else 'Unknown')

# Fix aircraft names
fixes = {'Boeing 747- 400': 'Boeing 747-400', 'Boeing 747 400': 'Boeing 747-400',
         'E-170': 'E170', 'E-190': 'E190',
         'Embraer170': 'Embraer 170', 'Embraer-190': 'Embraer 190'}
for old, new in fixes.items():
    pdf['Aircraft'] = pdf['Aircraft'].replace(old, new)

# DateFlown → FlightMonth + FlightYear
def extract_my(ds):
    if pd.isna(ds): return None, None
    parts = str(ds).strip().split()
    return (parts[0], int(parts[1])) if len(parts) >= 2 else (parts[0], None)

pdf['FlightMonth'], pdf['FlightYear'] = zip(*pdf['DateFlown'].apply(extract_my))

# Route → Departure + Destination
def split_route(r):
    m = re.match(r'(.+) to (.+)', str(r))
    return (m.group(1).strip(), m.group(2).strip()) if m else (None, None)

pdf['Departure'], pdf['Destination'] = zip(*pdf['Route'].apply(split_route))

city_map = {'LHR': 'Heathrow', 'London Heathrow': 'Heathrow', 'LGW': 'Gatwick',
            'London Gatwick': 'Gatwick', 'BKK': 'Suvarnabhumi', 'MAN': 'Manchester',
            'JFK': 'John F. Kennedy', 'GLA': 'Glasgow', 'LCY': 'London',
            'SIN': 'Singapore', 'YYZ': 'Toronto', 'ATH': 'Athens', 'MIA': 'Miami',
            'JNB': 'O.R. Tambo', 'SFO': 'San Francisco', 'AMS': 'Amsterdam',
            'YVR': 'Vancouver', 'HKG': 'Hong Kong', 'London ': 'London',
            'CPT': 'Cape Town', 'KUL': 'Kuala Lumpur', 'GVA': 'Geneva',
            'DXB': 'Dubai', 'BOS': 'Boston', 'EDI': 'Edinburgh', 'BGI': 'Grantley Adams'}
for o, n in city_map.items():
    pdf['Departure'] = pdf['Departure'].replace(o, n)
    pdf['Destination'] = pdf['Destination'].replace(o, n)

# Feature engineering
pdf['ReviewLength'] = pdf['ReviewBody'].str.len()
pdf['RecommendedLabel'] = pdf['Recommended'].map({'yes': 1, 'no': 0})
pdf['TotalServiceScore'] = pdf[['SeatComfort', 'CabinStaffService', 'GroundService',
                                 'Food&Beverages', 'InflightEntertainment']].sum(axis=1)

pdf.to_csv('./data/processedData.csv', index=False)
print(f"Processed: {pdf.shape[0]} rows, {pdf.shape[1]} columns")
print(f"Recommended: yes={pdf['RecommendedLabel'].sum():.0f}, no={len(pdf)-pdf['RecommendedLabel'].sum():.0f}")
print(f"Columns: {pdf.columns.tolist()}")

# ===========================================================================
# SPARK SETUP
# ===========================================================================
import findspark
findspark.init()

from pyspark.sql import SparkSession
from pyspark.sql.types import FloatType, StringType, IntegerType, StructField, StructType
from pyspark.sql.functions import (col, when, count, avg, stddev, desc, least, greatest,
                                   lit, udf, lower, length, explode, split, regexp_replace,
                                   row_number, rank, sum as spark_sum)
from pyspark.ml.feature import VectorAssembler, StringIndexer, OneHotEncoder
from pyspark.ml.evaluation import (BinaryClassificationEvaluator, MulticlassClassificationEvaluator,
                                    RegressionEvaluator)
from pyspark.ml import Pipeline
from pyspark.ml.stat import Correlation
from pyspark.ml.classification import RandomForestClassifier, DecisionTreeClassifier, GBTClassifier, LogisticRegression
from pyspark.ml.regression import RandomForestRegressor
from pyspark.sql.window import Window

os.environ['PYSPARK_PYTHON'] = '/home/xzh/anaconda3/bin/python3'
os.environ['PYSPARK_DRIVER_PYTHON'] = '/home/xzh/anaconda3/bin/python3'

spark = SparkSession.builder \
    .appName('BA Merged Analysis') \
    .master('local') \
    .config('spark.sql.warehouse.dir', 'file:///tmp/spark-warehouse') \
    .config('spark.hadoop.fs.defaultFS', 'file:///') \
    .getOrCreate()
spark.sparkContext.setLogLevel('ERROR')

# Build schema
schema_fields = []
for col_name in pdf.columns:
    if col_name in num_cols:
        schema_fields.append(StructField(col_name, FloatType(), True))
    elif col_name in ['ReviewLength', 'RecommendedLabel', 'FlightYear']:
        schema_fields.append(StructField(col_name, IntegerType(), True))
    else:
        schema_fields.append(StructField(col_name, StringType(), True))
schema = StructType(schema_fields)

data = spark.createDataFrame(pdf, schema=schema)
data.createOrReplaceTempView('data')
total = data.count()
print(f"\nSpark DataFrame: {total} rows")

# ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
# ANALYSIS 1: Verified vs Unverified Reviews (from ss2)
# ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
print("\n" + "=" * 70)
print("A1 (ss2): Verified vs Unverified Reviews")
print("=" * 70)

v1 = data.groupBy('VerifiedReview').agg(
    count('*').alias('Count'),
    avg('OverallRating').alias('AvgRating'),
    avg('SeatComfort').alias('AvgSeat'),
    avg('CabinStaffService').alias('AvgCabin'),
    avg('GroundService').alias('AvgGround'),
    avg('Food&Beverages').alias('AvgFood'),
    avg('InflightEntertainment').alias('AvgEnt'),
    avg('ValueForMoney').alias('AvgValue'),
    avg('ReviewLength').alias('AvgLength'))
v1.show(truncate=False)
v1.toPandas().to_csv('./data/a1_verified_analysis.csv', index=False)

v1_dist = data.withColumn('Bucket',
    when(col('OverallRating') <= 2, '1-2')
    .when(col('OverallRating') <= 4, '3-4')
    .when(col('OverallRating') <= 6, '5-6')
    .when(col('OverallRating') <= 8, '7-8')
    .otherwise('9-10')
).groupBy('VerifiedReview', 'Bucket').count().orderBy('VerifiedReview', 'Bucket')
v1_dist.toPandas().to_csv('./data/a1_verified_rating_dist.csv', index=False)

# ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
# ANALYSIS 2: Value for Money Correlation (from ss2)
# ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
print("\n" + "=" * 70)
print("A2 (ss2): Value for Money as Key Driver")
print("=" * 70)

corr_cols = ['OverallRating', 'ValueForMoney', 'SeatComfort', 'CabinStaffService',
             'GroundService', 'Food&Beverages', 'InflightEntertainment']
asm = VectorAssembler(inputCols=corr_cols, outputCol='f')
cm = Correlation.corr(asm.transform(data).select('f'), 'f', 'pearson').first()[0]
corr_pd = pd.DataFrame(cm.toArray(), columns=corr_cols, index=corr_cols)
print("Correlation with OverallRating:")
for k in corr_pd['OverallRating'].sort_values(ascending=False).index:
    print(f"  {k}: {corr_pd.loc[k, 'OverallRating']:.4f}")
corr_pd.to_csv('./data/a2_value_corr.csv')

a2_seat = data.groupBy('SeatType').agg(
    count('*').alias('Count'), avg('ValueForMoney').alias('AvgValue'), avg('OverallRating').alias('AvgRating')
).orderBy(desc('AvgRating'))
a2_seat.toPandas().to_csv('./data/a2_seat_value.csv', index=False)

a2_trav = data.groupBy('TypeOfTraveller').agg(
    count('*').alias('Count'), avg('ValueForMoney').alias('AvgValue'), avg('OverallRating').alias('AvgRating')
).orderBy(desc('AvgValue'))
a2_trav.toPandas().to_csv('./data/a2_traveller_value.csv', index=False)

# ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
# ANALYSIS 3: Review Length vs Rating (from ss2)
# ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
print("\n" + "=" * 70)
print("A3 (ss2): Review Length vs Rating (Negative Bias)")
print("=" * 70)

a3 = data.groupBy('OverallRating').agg(
    count('*').alias('Count'), avg('ReviewLength').alias('AvgLen'), stddev('ReviewLength').alias('StdLen')
).orderBy('OverallRating')

a3_pd = a3.toPandas()
lo = a3_pd[a3_pd['OverallRating'] <= 2]['AvgLen'].mean()
hi = a3_pd[a3_pd['OverallRating'] >= 9]['AvgLen'].mean()
print(f"  Low ratings (1-2) avg length: {lo:.0f} chars")
print(f"  High ratings (9-10) avg length: {hi:.0f} chars")
print(f"  Negative bias: {(lo-hi)/hi*100:.1f}% longer for negative reviews")
a3_pd.to_csv('./data/a3_rating_length.csv', index=False)

a3_lt = data.withColumn('Bucket',
    when(col('OverallRating') <= 3, 'Low(1-3)')
    .when(col('OverallRating') <= 6, 'Mid(4-6)')
    .otherwise('High(7-10)')
).groupBy('Bucket', 'TypeOfTraveller').agg(
    count('*').alias('Count'), avg('ReviewLength').alias('AvgLen')
).orderBy('Bucket', desc('AvgLen'))
a3_lt.toPandas().to_csv('./data/a3_length_traveller.csv', index=False)

# ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
# ANALYSIS 4: Yearly Trends (from ss2)
# ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
print("\n" + "=" * 70)
print("A4 (ss2): Yearly Service Quality Trends")
print("=" * 70)

a4 = data.groupBy('FlightYear').agg(
    count('*').alias('Count'), avg('OverallRating').alias('AvgRating'),
    avg('SeatComfort').alias('AvgSeat'), avg('CabinStaffService').alias('AvgCabin'),
    avg('GroundService').alias('AvgGround'), avg('Food&Beverages').alias('AvgFood'),
    avg('ValueForMoney').alias('AvgValue'), avg('InflightEntertainment').alias('AvgEnt')
).orderBy('FlightYear')
a4_pd = a4.toPandas()
print("Yearly OverallRating trend:")
for _, r in a4_pd.iterrows():
    print(f"  {int(r['FlightYear'])}: {r['AvgRating']:.2f} ({int(r['Count'])} reviews)")
a4_pd.to_csv('./data/a4_yearly_trend.csv', index=False)

a4_ym = data.groupBy('FlightYear', 'FlightMonth').agg(
    count('*').alias('Count'), avg('OverallRating').alias('AvgRating')
).orderBy('FlightYear', 'FlightMonth')
a4_ym.toPandas().to_csv('./data/a4_yearly_monthly.csv', index=False)

a4_s = data.withColumn('Sentiment',
    when(col('OverallRating') >= 6, 'Positive').otherwise('Negative')
).groupBy('FlightYear', 'Sentiment').agg(count('*').alias('Count')).orderBy('FlightYear', 'Sentiment')
a4_s.toPandas().to_csv('./data/a4_yearly_sentiment.csv', index=False)

# ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
# ANALYSIS 5: Service Weak-Link (from ss2)
# ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
print("\n" + "=" * 70)
print("A5 (ss2): Service Weak-Link Analysis")
print("=" * 70)

svc = ['SeatComfort', 'CabinStaffService', 'GroundService', 'Food&Beverages', 'InflightEntertainment']
gap = data.withColumn('MinSvc', least(*svc)).withColumn('MaxSvc', greatest(*svc)) \
          .withColumn('Gap', col('MaxSvc') - col('MinSvc'))

wl = [(c, gap.filter(col(c) == col('MinSvc')).count()) for c in svc]
wl_df = spark.createDataFrame(wl, ['Service', 'WeakCount'])
wl_df = wl_df.withColumn('Pct', col('WeakCount') / total * 100).orderBy(desc('WeakCount'))
wl_df.show()
wl_df.toPandas().to_csv('./data/a5_weakest_link.csv', index=False)

a5_seat = gap.groupBy('SeatType').agg(
    avg('SeatComfort').alias('S_Seat'), avg('CabinStaffService').alias('S_Cabin'),
    avg('GroundService').alias('S_Ground'), avg('Food&Beverages').alias('S_Food'),
    avg('InflightEntertainment').alias('S_Ent'), avg('Gap').alias('AvgGap')
).orderBy(desc('AvgGap'))
a5_seat.toPandas().to_csv('./data/a5_seat_weakest.csv', index=False)

a5_rating = gap.withColumn('Level',
    when(col('OverallRating') <= 2, 'Very Low').when(col('OverallRating') <= 4, 'Low')
    .when(col('OverallRating') <= 6, 'Medium').when(col('OverallRating') <= 8, 'High')
    .otherwise('Very High')
).groupBy('Level').agg(
    avg('SeatComfort').alias('S_Seat'), avg('CabinStaffService').alias('S_Cabin'),
    avg('GroundService').alias('S_Ground'), avg('Food&Beverages').alias('S_Food'),
    avg('InflightEntertainment').alias('S_Ent'), avg('Gap').alias('AvgGap')
).orderBy('Level')
a5_rating.toPandas().to_csv('./data/a5_rating_weakest.csv', index=False)

# ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
# ANALYSIS 6: Recommendation Classification (from ss2)
# ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
print("\n" + "=" * 70)
print("A6 (ss2): Recommendation Classification")
print("=" * 70)

cdata = data.select('Recommended', 'TypeOfTraveller', 'SeatType', 'FlightMonth',
                    'SeatComfort', 'CabinStaffService', 'GroundService',
                    'Food&Beverages', 'InflightEntertainment', 'ValueForMoney', 'ReviewLength').dropna()

li = StringIndexer(inputCol='Recommended', outputCol='label')
ti = StringIndexer(inputCol='TypeOfTraveller', outputCol='Ti')
te = OneHotEncoder(inputCol='Ti', outputCol='Tv', dropLast=False)
si = StringIndexer(inputCol='SeatType', outputCol='Si')
se = OneHotEncoder(inputCol='Si', outputCol='Sv', dropLast=False)
mi = StringIndexer(inputCol='FlightMonth', outputCol='Mi')
me = OneHotEncoder(inputCol='Mi', outputCol='Mv', dropLast=False)
asm2 = VectorAssembler(
    inputCols=['Tv', 'Sv', 'Mv', 'SeatComfort', 'CabinStaffService', 'GroundService',
               'Food&Beverages', 'InflightEntertainment', 'ValueForMoney', 'ReviewLength'],
    outputCol='features')
pl = Pipeline(stages=[li, ti, te, si, se, mi, me, asm2])
prep = pl.fit(cdata).transform(cdata)
tr, te2 = prep.randomSplit([0.7, 0.3], seed=42)
print(f"  Train: {tr.count()}, Test: {te2.count()}")

cls = [
    ('LogisticRegression', LogisticRegression(featuresCol='features', labelCol='label', maxIter=30)),
    ('DecisionTree', DecisionTreeClassifier(featuresCol='features', labelCol='label', maxDepth=8)),
    ('RandomForest', RandomForestClassifier(featuresCol='features', labelCol='label', numTrees=30)),
    ('GBT', GBTClassifier(featuresCol='features', labelCol='label', maxIter=20)),
]
res = []
for nm, cl in cls:
    print(f"  Training {nm}...")
    m = cl.fit(tr)
    p = m.transform(te2)
    acc = MulticlassClassificationEvaluator(labelCol='label', predictionCol='prediction', metricName='accuracy').evaluate(p)
    f1 = MulticlassClassificationEvaluator(labelCol='label', predictionCol='prediction', metricName='f1').evaluate(p)
    auc = BinaryClassificationEvaluator(labelCol='label', rawPredictionCol='rawPrediction', metricName='areaUnderROC').evaluate(p)
    res.append((nm, acc, f1, auc))
    print(f"    Accuracy={acc:.4f}, F1={f1:.4f}, AUC={auc:.4f}")
    if hasattr(m, 'featureImportances'):
        imp = m.featureImportances.toArray()
        fn = ['T_0','T_1','Seat_0','Seat_1','Seat_2','Seat_3','M_0','M_1',
              'SeatComfort','CabinStaff','Ground','Food','Ent','Value','Length']
        n = min(len(fn), len(imp))
        pd.DataFrame({'Feature': fn[:n], 'Importance': imp[:n]}).to_csv(
            f'./data/a6_{nm.replace(" ","_").lower()}_importance.csv', index=False)

res_df = spark.createDataFrame(res, ['Model', 'Accuracy', 'F1', 'AUC'])
res_df.show()
res_df.toPandas().to_csv('./data/a6_clf_results.csv', index=False)

# Confusion matrix for RF
rf = RandomForestClassifier(featuresCol='features', labelCol='label', numTrees=30)
rf_m = rf.fit(tr)
rf_p = rf_m.transform(te2)
rf_p.groupBy('label', 'prediction').count().orderBy('label', 'prediction').toPandas().to_csv('./data/a6_confusion.csv', index=False)

# ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
# ANALYSIS 7: Cabin Service Sensitivity (from ss3 / 1.md Ext 1)
# ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
print("\n" + "=" * 70)
print("A7 (ss3/1.md Ext1): Cabin Service Sensitivity")
print("=" * 70)

a7 = []
for st in [r['SeatType'] for r in data.select('SeatType').distinct().collect()]:
    sd = data.filter(col('SeatType') == st)
    n = sd.count()
    if n < 30: continue
    vec = VectorAssembler(inputCols=['OverallRating'] + svc, outputCol='f').transform(sd).select('f')
    cm2 = Correlation.corr(vec, 'f', 'spearman').first()[0].toArray()
    row = {'SeatType': st, 'Count': n}
    for i, cn in enumerate(['OverallRating'] + svc):
        if cn != 'OverallRating':
            row[f'{cn}_Corr'] = cm2[0][i]
    a7.append(row)
    print(f"  {st} (n={n}): " + ", ".join([f"{k}={row[k]:.3f}" for k in row if k.endswith('_Corr')]))
pd.DataFrame(a7).to_csv('./data/a7_cabin_sensitivity.csv', index=False)

# ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
# ANALYSIS 8: Rating-Recommendation Inconsistency (from ss3 / 1.md Ext 2)
# ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
print("\n" + "=" * 70)
print("A8 (ss3/1.md Ext2): Rating-Recommendation Inconsistency")
print("=" * 70)

# --- 8a: Dual Model Feature Importance Comparison ---
print("--- 8a: Dual Model Comparison ---")

mdata = data.select('OverallRating', 'RecommendedLabel', 'TypeOfTraveller', 'SeatType', 'FlightMonth',
                    'SeatComfort', 'CabinStaffService', 'GroundService',
                    'Food&Beverages', 'InflightEntertainment', 'ValueForMoney', 'ReviewLength').dropna()

fp = Pipeline(stages=[ti, te, si, se, mi, me, asm2]).fit(mdata)
mprep = fp.transform(mdata)
mtr, mte = mprep.randomSplit([0.7, 0.3], seed=42)

# Regression for Satisfaction
reg = RandomForestRegressor(featuresCol='features', labelCol='OverallRating', numTrees=30, seed=42)
reg_m = reg.fit(mtr)
reg_pred = reg_m.transform(mte)
reg_rmse = RegressionEvaluator(labelCol='OverallRating', predictionCol='prediction', metricName='rmse').evaluate(reg_pred)
reg_r2 = RegressionEvaluator(labelCol='OverallRating', predictionCol='prediction', metricName='r2').evaluate(reg_pred)
reg_imp = reg_m.featureImportances.toArray()
print(f"  Regression: RMSE={reg_rmse:.4f}, R2={reg_r2:.4f}")

# Classification for Loyalty
clf = RandomForestClassifier(featuresCol='features', labelCol='RecommendedLabel', numTrees=30, seed=42)
clf_m = clf.fit(mtr)
clf_pred = clf_m.transform(mte)
clf_acc = MulticlassClassificationEvaluator(labelCol='RecommendedLabel', predictionCol='prediction', metricName='accuracy').evaluate(clf_pred)
clf_auc = BinaryClassificationEvaluator(labelCol='RecommendedLabel', rawPredictionCol='rawPrediction', metricName='areaUnderROC').evaluate(clf_pred)
clf_imp = clf_m.featureImportances.toArray()
print(f"  Classification: Accuracy={clf_acc:.4f}, AUC={clf_auc:.4f}")

fn8 = ['T_0','T_1','T_2','T_3','S_0','S_1','S_2','S_3',
       'M_0','M_1','M_2','M_3','M_4','M_5','M_6','M_7','M_8','M_9','M_10','M_11',
       'SeatComfort','CabinStaff','Ground','Food','Ent','Value','Length']
n8 = min(len(fn8), len(reg_imp), len(clf_imp))
dual = pd.DataFrame({'Feature': fn8[:n8],
                     'Reg_Importance': reg_imp[:n8],
                     'Clf_Importance': clf_imp[:n8]})
dual['Reg_Norm'] = dual['Reg_Importance'] / dual['Reg_Importance'].sum()
dual['Clf_Norm'] = dual['Clf_Importance'] / dual['Clf_Importance'].sum()
dual['Diff'] = dual['Clf_Norm'] - dual['Reg_Norm']
dual.to_csv('./data/a8_dual_importance_full.csv', index=False)

# Semantic aggregation
groups = {'SeatComfort': ['SeatComfort'], 'CabinStaff': ['CabinStaff'],
          'Ground': ['Ground'], 'Food': ['Food'], 'Ent': ['Ent'],
          'Value': ['Value'], 'Length': ['Length']}
agg = []
for g, fs in groups.items():
    agg.append({'Feature': g, 'Reg_Norm': dual[dual['Feature'].isin(fs)]['Reg_Norm'].sum(),
                'Clf_Norm': dual[dual['Feature'].isin(fs)]['Clf_Norm'].sum()})
agg_pd = pd.DataFrame(agg)
agg_pd['Diff'] = agg_pd['Clf_Norm'] - agg_pd['Reg_Norm']
agg_pd.to_csv('./data/a8_dual_importance_agg.csv', index=False)
print("  Aggregated importance:")
for _, r in agg_pd.iterrows():
    d = "LOYALTY↑" if r['Diff'] > 0 else "SATISFACTION↑"
    print(f"    {r['Feature']}: Reg={r['Reg_Norm']:.4f}, Clf={r['Clf_Norm']:.4f}, Diff={r['Diff']:+.4f} → {d}")

# --- 8b: Anomaly Groups ---
print("\n--- 8b: Anomaly Groups ---")
ano = data.select('OverallRating', 'Recommended', 'RecommendedLabel', 'SeatType', 'TypeOfTraveller',
                  'ReviewHeader', 'SeatComfort', 'CabinStaffService', 'GroundService',
                  'Food&Beverages', 'InflightEntertainment', 'ValueForMoney')

hrlr = ano.filter((col('OverallRating') >= 7) & (col('Recommended') == 'no'))
lrhr = ano.filter((col('OverallRating') <= 4) & (col('Recommended') == 'yes'))
print(f"  HRLR (High Rate, Low Rec): {hrlr.count()} ({hrlr.count()/total*100:.1f}%)")
print(f"  LRHR (Low Rate, High Rec): {lrhr.count()} ({lrhr.count()/total*100:.1f}%)")

# Anomaly service profiles
hrlr_s = hrlr.select(avg('SeatComfort').alias('Seat'), avg('CabinStaffService').alias('Cabin'),
                     avg('GroundService').alias('Ground'), avg('Food&Beverages').alias('Food'),
                     avg('InflightEntertainment').alias('Ent'), avg('ValueForMoney').alias('Value')).toPandas()
lrhr_s = lrhr.select(avg('SeatComfort').alias('Seat'), avg('CabinStaffService').alias('Cabin'),
                     avg('GroundService').alias('Ground'), avg('Food&Beverages').alias('Food'),
                     avg('InflightEntertainment').alias('Ent'), avg('ValueForMoney').alias('Value')).toPandas()
pd.DataFrame({
    'Metric': svc + ['ValueForMoney'],
    'HRLR_Avg': hrlr_s.iloc[0].values if len(hrlr_s) > 0 else [0]*6,
    'LRHR_Avg': lrhr_s.iloc[0].values if len(lrhr_s) > 0 else [0]*6,
}).to_csv('./data/a8_anomaly_profiles.csv', index=False)

# HRLR seat distribution
hrlr.groupBy('SeatType').count().orderBy(desc('count')).toPandas().to_csv('./data/a8_hrlr_seat.csv', index=False)
lrhr.groupBy('SeatType').count().orderBy(desc('count')).toPandas().to_csv('./data/a8_lrhr_seat.csv', index=False)

# HRLR top words
hrlr_kw = hrlr.select(lower(col('ReviewHeader')).alias('t'))
hrlr_w = hrlr_kw.withColumn('w', explode(split(regexp_replace(col('t'), '[^a-z0-9\\s]', ''), '\\s+')))
hrlr_w.filter(length('w') > 3).groupBy('w').count().orderBy(desc('count')).limit(25).toPandas().to_csv(
    './data/a8_hrlr_keywords.csv', index=False)

# ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
# ANALYSIS 9: Low-score Root Cause & Priority (from ss3 / 1.md Ext 3)
# ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
print("\n" + "=" * 70)
print("A9 (ss3/1.md Ext3): Low-score Root Cause & Priority")
print("=" * 70)

low = data.filter(col('OverallRating') <= 4)
print(f"  Low-score reviews (<=4): {low.count()} ({low.count()/total*100:.1f}%)")

# Keyword dictionary from 1.md
complaint_dict = {
    'Ground Service': ['check.in', 'boarding', 'luggage', 'baggage', 'ground staff', 'checkin',
                       'check in', 'airport', 'terminal', 'gate', 'desk', 'counter', 'ground crew'],
    'Food & Beverages': ['food', 'drink', 'meal', 'beverage', 'snack', 'breakfast', 'lunch',
                         'dinner', 'catering', 'sandwich', 'water', 'coffee', 'tea', 'wine', 'menu'],
    'Seat Comfort': ['seat', 'legroom', 'comfort', 'leg room', 'cramped', 'narrow', 'recline',
                     'space', 'squash', 'tight', 'uncomfortable', 'pitch', 'width'],
    'Cabin Staff': ['crew', 'cabin', 'attendant', 'staff', 'hostess', 'flight attendant',
                    'steward', 'rude', 'unfriendly', 'unhelpful', 'professional'],
    'Delay & Cancel': ['delay', 'late', 'cancel', 'delay flight', 'cancelled', 'wait', 'hours late',
                       'reschedule', 'rebook', 'strand', 'miss connect'],
    'Booking & Refund': ['booking', 'refund', 'money', 'pay', 'charge', 'fee', 'cost', 'price',
                         'expensive', 'ticket', 'reservation', 'voucher', 'compensate', 'customer service'],
    'Baggage': ['bag', 'luggage', 'baggage', 'suitcase', 'carry on', 'hand luggage',
                'checked bag', 'lost luggage', 'broken bag', 'damaged'],
    'In-flight Ent': ['entertainment', 'movie', 'screen', 'wifi', 'headphone', 'tv', 'film',
                       'connect', 'internet', 'usb', 'power', 'charger', 'earphone'],
}

def classify_complaint(text):
    if not text: return 'Uncategorized'
    t = str(text).lower()
    for cat, kws in complaint_dict.items():
        if any(kw in t for kw in kws):
            return cat
    return 'Uncategorized'

cat_udf = udf(classify_complaint, StringType())
low_cat = low.withColumn('Category', cat_udf(col('ReviewBody')))

a9 = low_cat.groupBy('Category').agg(
    count('*').alias('Freq'), avg('OverallRating').alias('AvgRating')
).orderBy(desc('Freq'))

a9_pd = a9.toPandas()
a9_pd['Impact'] = 5 - a9_pd['AvgRating']
a9_pd['Priority'] = a9_pd['Freq'] * a9_pd['Impact']
a9_pd['FreqPct'] = a9_pd['Freq'] / a9_pd['Freq'].sum() * 100
a9_pd = a9_pd.sort_values('Priority', ascending=False)
a9_pd.to_csv('./data/a9_complaint_priority.csv', index=False)

print("\n  Priority Ranking:")
for _, r in a9_pd.iterrows():
    print(f"    {r['Category']:25s} | Freq={int(r['Freq']):4d} ({r['FreqPct']:5.1f}%) | "
          f"Avg={r['AvgRating']:.2f} | Impact={r['Impact']:.2f} | Priority={r['Priority']:.0f}")

# ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
# FINAL SUMMARY
# ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
print("\n" + "=" * 70)
print("ALL 9 ANALYSES COMPLETED")
print("=" * 70)
print(f"{'#':<4} {'Source':<15} {'Analysis':<50}")
print("-" * 70)
for i, (src, name) in enumerate([
    ('ss2', 'Verified vs Unverified Reviews'),
    ('ss2', 'Value for Money Correlation'),
    ('ss2', 'Review Length vs Rating'),
    ('ss2', 'Yearly Service Trends'),
    ('ss2', 'Service Weak-Link Analysis'),
    ('ss2', 'Recommendation Classification'),
    ('ss3/1.md Ext1', 'Cabin Service Sensitivity'),
    ('ss3/1.md Ext2', 'Rating-Recommendation Inconsistency'),
    ('ss3/1.md Ext3', 'Low-score Root Cause & Priority'),
], 1):
    print(f"{i:<4} {src:<15} {name:<50}")

print(f"\nData files: {len([f for f in os.listdir('./data/') if f.endswith('.csv')])} CSVs")
spark.stop()
