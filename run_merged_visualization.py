"""
Merged Visualizations: ss2 + ss3 → ss5 (18 charts)
"""
import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from matplotlib.colors import LinearSegmentedColormap
import seaborn as sns
from scipy import stats
import warnings
warnings.filterwarnings('ignore')

os.makedirs('result', exist_ok=True)

BA_DARK = '#1F4F59'
BA_GREEN = '#7EA00E'
BA_LIGHT = '#54C0CC'
BA_YELLOW = '#DCD964'
BA_OLIVE = '#213502'
RED = '#E74C3C'
ORANGE = '#E67E22'
PURPLE = '#8E44AD'
COLORS_5 = [BA_DARK, BA_GREEN, BA_LIGHT, BA_YELLOW, BA_OLIVE]

plt.rcParams['figure.dpi'] = 120
plt.rcParams['savefig.dpi'] = 300
plt.rcParams['savefig.bbox'] = 'tight'
sns.set_style("whitegrid")

# ================================================================
# A1: Verified vs Unverified (from ss2)
# ================================================================
print("A1: Verified vs Unverified — Radar + Rating Distribution")
v1 = pd.read_csv('./data/a1_verified_analysis.csv')

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(16, 6), subplot_kw={'polar': None})

# Radar
dims = ['AvgSeat', 'AvgCabin', 'AvgGround', 'AvgFood', 'AvgEnt', 'AvgValue']
dlabels = ['Seat Comfort', 'Cabin Staff', 'Ground Service', 'Food&Beverages', 'Inflight Ent.', 'Value for Money']
angles = np.linspace(0, 2*np.pi, len(dims), endpoint=False).tolist() + [0]

ax1 = fig.add_subplot(1, 2, 1, polar=True)
for idx, vf in enumerate(['true', 'false']):
    row = v1[v1['VerifiedReview'] == vf]
    if len(row) == 0: continue
    vals = row[dims].values[0].tolist() + [row[dims].values[0][0]]
    label = 'Verified (Real)' if vf == 'true' else 'Unverified'
    ax1.fill(angles, vals, alpha=0.15, color=COLORS_5[idx])
    ax1.plot(angles, vals, 'o-', linewidth=2, label=label, color=COLORS_5[idx], markersize=5)
ax1.set_xticks(angles[:-1]); ax1.set_xticklabels(dlabels, fontsize=9)
ax1.set_ylim(0, 4.5); ax1.legend(loc='upper right', bbox_to_anchor=(1.3, 1.1), fontsize=9)
ax1.set_title('Verified vs Unverified Service Profile', fontsize=12, fontweight='bold', pad=20)

# Rating distribution
dist = pd.read_csv('./data/a1_verified_rating_dist.csv')
buckets = ['1-2', '3-4', '5-6', '7-8', '9-10']
x = np.arange(len(buckets)); w = 0.35
for st, clr, off, lb in [('true', BA_DARK, 0.5, 'Verified'), ('false', BA_LIGHT, -0.5, 'Unverified')]:
    sub = dist[dist['VerifiedReview'] == st]
    cnts = [sub[sub['Bucket'] == b]['count'].values[0] if b in sub['Bucket'].values else 0 for b in buckets]
    ax2.bar(x + off*w/2, cnts, w, label=lb, color=clr, edgecolor='white')
ax2.set_xticks(x); ax2.set_xticklabels(buckets, fontsize=10)
ax2.set_ylabel('Count', fontsize=11); ax2.legend(fontsize=9)
ax2.set_title('Rating Distribution by Verification', fontsize=12, fontweight='bold')
ax2.spines['top'].set_visible(False); ax2.spines['right'].set_visible(False)
plt.tight_layout(); plt.savefig('result/a1_verified.png'); plt.close()

# ================================================================
# A2: Value for Money (from ss2)
# ================================================================
print("A2: Value for Money — Correlation Bar + Scatter")
corr = pd.read_csv('./data/a2_value_corr.csv', index_col=0)
cr = corr['OverallRating'].drop('OverallRating').sort_values(ascending=True)

fig, ax = plt.subplots(figsize=(10, 5))
clrs = [RED if v == cr.max() else BA_DARK for v in cr.values]
ax.barh(range(len(cr)), cr.values, color=clrs, edgecolor='white', height=0.6)
for i, (n, v) in enumerate(cr.items()):
    ax.text(v+0.008, i, f'{v:.3f}', va='center', fontsize=11, fontweight='bold' if v>0.85 else 'normal')
ax.set_yticks(range(len(cr))); ax.set_yticklabels([n.replace('_',' ') for n in cr.index], fontsize=12)
ax.set_xlabel('Pearson r with OverallRating', fontsize=12)
ax.set_title('A2: Value for Money — Strongest Satisfaction Driver (r=0.873)', fontsize=14, fontweight='bold')
ax.set_xlim(0, 1.05); ax.spines['top'].set_visible(False); ax.spines['right'].set_visible(False)
plt.tight_layout(); plt.savefig('result/a2_value_correlation.png'); plt.close()

# ================================================================
# A3: Review Length (from ss2)
# ================================================================
print("A3: Review Length — Rating vs Length")
lend = pd.read_csv('./data/a3_rating_length.csv')

fig, ax1 = plt.subplots(figsize=(12, 5))
ax1.bar(lend['OverallRating'], lend['Count'], color=BA_LIGHT, alpha=0.4, width=0.6, label='Review Count')
ax1.set_xlabel('Overall Rating', fontsize=12); ax1.set_ylabel('Review Count', fontsize=12, color=BA_LIGHT)
ax2 = ax1.twinx()
ax2.plot(lend['OverallRating'], lend['AvgLen'], 'o-', color=RED, linewidth=2, markersize=6, label='Avg Length')
ax2.set_ylabel('Avg Review Length (chars)', fontsize=12, color=RED)
ax1.set_title('A3: Negative Bias Confirmed — Low Ratings = 50%+ Longer Reviews', fontsize=14, fontweight='bold')
lines1, labels1 = ax1.get_legend_handles_labels(); lines2, labels2 = ax2.get_legend_handles_labels()
ax1.legend(lines1+lines2, labels1+labels2, loc='upper right')
ax1.spines['top'].set_visible(False)
plt.tight_layout(); plt.savefig('result/a3_review_length.png'); plt.close()

# ================================================================
# A4: Yearly Trends (from ss2)
# ================================================================
print("A4: Yearly Trends — Multi-line + Sentiment Stack")
y4 = pd.read_csv('./data/a4_yearly_trend.csv')
ys = pd.read_csv('./data/a4_yearly_sentiment.csv')

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(16, 6))
metrics = ['AvgRating', 'AvgSeat', 'AvgCabin', 'AvgGround', 'AvgFood', 'AvgValue']
labels = ['Overall', 'Seat', 'Cabin', 'Ground', 'Food', 'Value']
clrs = [BA_OLIVE, BA_GREEN, BA_LIGHT, BA_YELLOW, RED, BA_DARK]
mkrs = ['o','s','^','D','v','p']
for m, lb, clr, mr in zip(metrics, labels, clrs, mkrs):
    ax1.plot(y4['FlightYear'], y4[m], marker=mr, linewidth=2, markersize=7, label=lb, color=clr)
ax1.set_xlabel('Year', fontsize=12); ax1.set_ylabel('Avg Score', fontsize=12)
ax1.set_title('Yearly Service Quality Trends', fontsize=13, fontweight='bold')
ax1.legend(loc='center left', bbox_to_anchor=(1.01, 0.5), fontsize=9); ax1.grid(axis='y', alpha=0.3)

piv = ys.pivot_table(values='Count', index='FlightYear', columns='Sentiment', aggfunc='sum').fillna(0)
piv['PosPct'] = piv['Positive'] / piv.sum(axis=1) * 100
x_yr = piv.index.astype(int)
ax2.bar(x_yr, piv['Positive'], label='Positive', color=BA_GREEN, edgecolor='white')
ax2.bar(x_yr, piv['Negative'], bottom=piv['Positive'], label='Negative', color=RED, edgecolor='white')
ax2.set_xlabel('Year', fontsize=12); ax2.set_ylabel('Review Count', fontsize=12)
ax2.set_title('Yearly Sentiment Split', fontsize=13, fontweight='bold')
ax2.legend(fontsize=9)
plt.tight_layout(); plt.savefig('result/a4_yearly_trends.png'); plt.close()

# ================================================================
# A5: Service Weak-Link (from ss2)
# ================================================================
print("A5: Weak-Link — Service Gap Bar + Seat Breakdown")
wl = pd.read_csv('./data/a5_weakest_link.csv').sort_values('Pct', ascending=True)

fig, ax = plt.subplots(figsize=(10, 5))
clrs_w = [RED if v == wl['Pct'].max() else BA_DARK for v in wl['Pct'].values]
ax.barh(wl['Service'], wl['Pct'], color=clrs_w, edgecolor='white', height=0.6)
for bar, pct, cnt in zip(ax.containers[0], wl['Pct'], wl['WeakCount']):
    ax.text(bar.get_width() + 0.3, bar.get_y() + bar.get_height()/2., f'{pct:.1f}% ({int(cnt)})', va='center', fontsize=10, fontweight='bold')
ax.set_xlabel('% of Reviews Where Service is LOWEST', fontsize=12)
ax.set_title('A5: Service Weak-Link — Inflight Entertainment is Biggest Drag', fontsize=14, fontweight='bold')
ax.set_xlim(0, wl['Pct'].max()*1.35); ax.spines['top'].set_visible(False); ax.spines['right'].set_visible(False)
plt.tight_layout(); plt.savefig('result/a5_weakest_link.png'); plt.close()

# ================================================================
# A6: Classification (from ss2)
# ================================================================
print("A6: Classification — Model Comparison + Confusion Matrix")
cres = pd.read_csv('./data/a6_clf_results.csv')

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))
x = np.arange(len(cres)); w = 0.22
for i, (m, c) in enumerate(zip(['Accuracy','F1','AUC'], [BA_DARK, BA_GREEN, BA_LIGHT])):
    ax1.bar(x + (i-1)*w, cres[m], w, label=m, color=c, edgecolor='white')
    for bar in ax1.containers[i]:
        ax1.text(bar.get_x()+bar.get_width()/2., bar.get_height()+0.005, f'{bar.get_height():.3f}', ha='center', va='bottom', fontsize=8)
ax1.set_xticks(x); ax1.set_xticklabels(cres['Model'], fontsize=10)
ax1.set_ylabel('Score', fontsize=12); ax1.set_ylim(0, 1.08); ax1.legend(fontsize=9)
ax1.set_title('Classifier Performance (Recommendation)', fontsize=12, fontweight='bold')
ax1.grid(axis='y', alpha=0.3); ax1.spines['top'].set_visible(False); ax1.spines['right'].set_visible(False)

cm_data = pd.read_csv('./data/a6_confusion.csv')
cm = np.zeros((2,2))
for _, r in cm_data.iterrows():
    cm[int(r['label']), int(r['prediction'])] = r['count']
sns.heatmap(cm, annot=True, fmt='.0f', cmap='Greens', ax=ax2, linewidths=1, linecolor='white',
            xticklabels=['Not Rec', 'Rec'], yticklabels=['Not Rec', 'Rec'], annot_kws={'fontsize': 20})
ax2.set_xlabel('Predicted', fontsize=12); ax2.set_ylabel('Actual', fontsize=12)
ax2.set_title('Confusion Matrix (Random Forest)', fontsize=12, fontweight='bold')
plt.tight_layout(); plt.savefig('result/a6_classification.png'); plt.close()

# ================================================================
# A7: Cabin Sensitivity (from ss3 / 1.md Ext1)
# ================================================================
print("A7: Cabin Sensitivity — Heatmap + Grouped Bars")
sens = pd.read_csv('./data/a7_cabin_sensitivity.csv', index_col=0)
sd = sens[[c for c in sens.columns if c.endswith('_Corr')]]
sd.columns = [c.replace('_Corr','') for c in sd.columns]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(18, 6))
sns.heatmap(sd.T, annot=True, fmt='.3f', cmap='YlOrRd', ax=ax1, linewidths=2, linecolor='white',
            center=0.6, annot_kws={'fontsize': 12}, cbar_kws={'label': 'Spearman r'})
# Highlight max per column
for j in range(sd.shape[1]):
    mx = np.argmax(sd.iloc[:, j].values)
    ax1.add_patch(plt.Rectangle((j, mx), 1, 1, fill=False, edgecolor=BA_DARK, lw=3))
ax1.set_title('A7: Cabin Service Sensitivity Heatmap\n(Bold box = top driver per cabin)', fontsize=13, fontweight='bold')
ax1.set_xlabel('Cabin Class', fontsize=12); ax1.set_ylabel('Service Dimension', fontsize=12)

x = np.arange(len(sd)); w = 0.2
for i, (dim, c) in enumerate(zip(sd.columns, [BA_DARK, RED, BA_GREEN, BA_LIGHT, ORANGE])):
    ax2.bar(x + (i-2)*w, sd[dim].values, w, label=dim, color=c, edgecolor='white')
ax2.set_xticks(x); ax2.set_xticklabels(sd.index, fontsize=11)
ax2.set_ylabel('Spearman r with OverallRating', fontsize=12)
ax2.set_title('Service Sensitivity by Cabin', fontsize=13, fontweight='bold')
ax2.legend(loc='upper left', bbox_to_anchor=(1.01, 1), fontsize=9)
ax2.set_ylim(0, 1.0); ax2.grid(axis='y', alpha=0.3); ax2.spines['top'].set_visible(False); ax2.spines['right'].set_visible(False)
plt.tight_layout(); plt.savefig('result/a7_cabin_sensitivity.png'); plt.close()

# ================================================================
# A8: Rating-Recommendation Inconsistency (from ss3 / 1.md Ext2)
# ================================================================
print("A8: Inconsistency — Dual Model + Anomaly Radar + Scatter")

# Dual model importance comparison
agg = pd.read_csv('./data/a8_dual_importance_agg.csv').sort_values('Diff', ascending=True)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(17, 6))
x = np.arange(len(agg)); w = 0.35
ax1.barh(x - w/2, agg['Reg_Norm'], w, label='Satisfaction (Regression)', color=BA_DARK, edgecolor='white')
ax1.barh(x + w/2, agg['Clf_Norm'], w, label='Loyalty (Classification)', color=BA_GREEN, edgecolor='white')
for i, (_, r) in enumerate(agg.iterrows()):
    if abs(r['Diff']) > 0.005:
        direction = '← Loyalty' if r['Diff'] > 0 else 'Satisfaction →'
        ax1.text(max(r['Reg_Norm'], r['Clf_Norm'])+0.008, i, direction, fontsize=9, color=RED if abs(r['Diff'])>0.01 else 'gray', va='center')
ax1.set_yticks(x); ax1.set_yticklabels(agg['Feature'], fontsize=10)
ax1.set_xlabel('Normalized Importance', fontsize=12)
ax1.set_title('A8a: Satisfaction vs Loyalty Feature Importance\n(Value → Satisfaction | Cabin/Food → Loyalty)', fontsize=12, fontweight='bold')
ax1.legend(loc='lower right', fontsize=9); ax1.spines['top'].set_visible(False); ax1.spines['right'].set_visible(False)

# Anomaly radar
ano = pd.read_csv('./data/a8_anomaly_profiles.csv')
ang = np.linspace(0, 2*np.pi, len(ano), endpoint=False).tolist() + [0]
ax2 = fig.add_subplot(1, 2, 2, polar=True)
hrlr_v = ano['HRLR_Avg'].tolist() + [ano['HRLR_Avg'].iloc[0]]
lrhr_v = ano['LRHR_Avg'].tolist() + [ano['LRHR_Avg'].iloc[0]]
ax2.fill(ang, hrlr_v, alpha=0.2, color=RED)
ax2.plot(ang, hrlr_v, 'o-', linewidth=2, label='High-Rating-Low-Recommend', color=RED, markersize=5)
ax2.fill(ang, lrhr_v, alpha=0.2, color=BA_GREEN)
ax2.plot(ang, lrhr_v, 'o-', linewidth=2, label='Low-Rating-High-Recommend', color=BA_GREEN, markersize=5)
ax2.set_xticks(ang[:-1]); ax2.set_xticklabels(ano['Metric'], fontsize=9)
ax2.set_ylim(0, 4.5); ax2.legend(loc='upper right', bbox_to_anchor=(1.4, 1.1), fontsize=8)
ax2.set_title('A8b: Anomaly Group Service Profiles\n(HRLR n=48, LRHR n=32)', fontsize=12, fontweight='bold', pad=20)
plt.tight_layout(); plt.savefig('result/a8_inconsistency.png'); plt.close()

# Importance scatter
dual = pd.read_csv('./data/a8_dual_importance_full.csv')
svc_feats = ['SeatComfort', 'CabinStaff', 'Ground', 'Food', 'Ent', 'Value', 'Length']
dual_svc = dual[dual['Feature'].isin(svc_feats)]
fig, ax = plt.subplots(figsize=(8, 7))
for _, r in dual_svc.iterrows():
    clr = RED if r['Diff'] > 0 else BA_DARK
    ax.scatter(r['Reg_Norm'], r['Clf_Norm'], s=200, alpha=0.7, edgecolors='white', linewidth=1.5, color=clr)
    ax.annotate(r['Feature'], (r['Reg_Norm'], r['Clf_Norm']), textcoords='offset points',
               xytext=(10, 5), fontsize=11, fontweight='bold', color=clr)
mv = max(dual_svc['Reg_Norm'].max(), dual_svc['Clf_Norm'].max()) * 1.1
ax.plot([0, mv], [0, mv], '--', color='gray', alpha=0.5)
ax.fill_between([0, mv], [0, mv], mv, alpha=0.05, color=RED)
ax.fill_between([0, mv], 0, [0, mv], alpha=0.05, color=BA_DARK)
ax.text(mv*0.7, mv*0.85, 'More for LOYALTY', fontsize=10, color=RED, alpha=0.7)
ax.text(mv*0.7, mv*0.15, 'More for SATISFACTION', fontsize=10, color=BA_DARK, alpha=0.7)
ax.set_xlabel('Satisfaction Model Importance', fontsize=12)
ax.set_ylabel('Loyalty Model Importance', fontsize=12)
ax.set_title('A8c: Satisfaction vs Loyalty — Feature Importance Scatter', fontsize=13, fontweight='bold')
ax.spines['top'].set_visible(False); ax.spines['right'].set_visible(False)
plt.tight_layout(); plt.savefig('result/a8_importance_scatter.png'); plt.close()

# ================================================================
# A9: Root Cause & Priority (from ss3 / 1.md Ext3)
# ================================================================
print("A9: Root Cause — Priority Bar + Pie + Frequency vs Severity")
pr = pd.read_csv('./data/a9_complaint_priority.csv')
pr = pr[pr['Category'] != 'Uncategorized'].sort_values('Priority', ascending=True)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(16, 6))
# Priority ranking
clrs_p = [RED if v == pr['Priority'].max() else ORANGE if v > pr['Priority'].median() else BA_GREEN for v in pr['Priority'].values]
ax1.barh(range(len(pr)), pr['Priority'], color=clrs_p, edgecolor='white', height=0.6)
for i, (bar, (_, r)) in enumerate(zip(ax1.containers[0], pr.iterrows())):
    ax1.text(bar.get_width()+15, bar.get_y()+bar.get_height()/2.,
             f'P={int(r["Priority"])} | {r["FreqPct"]:.1f}% | Avg={r["AvgRating"]:.2f}', va='center', fontsize=9, fontweight='bold')
ax1.set_yticks(range(len(pr))); ax1.set_yticklabels(pr['Category'], fontsize=10)
ax1.set_xlabel('Priority = Frequency × (5 − AvgRating)', fontsize=12)
ax1.set_title('A9: Improvement Priority Ranking\n("Where to invest FIRST?")', fontsize=13, fontweight='bold')
ax1.set_xlim(0, pr['Priority'].max()*1.45); ax1.spines['top'].set_visible(False); ax1.spines['right'].set_visible(False)

# Pie chart
pr_pie = pr.sort_values('Freq', ascending=True)
cols_pie = [BA_DARK, BA_GREEN, BA_LIGHT, BA_YELLOW, ORANGE, RED, PURPLE, '#95A5A6']
wedges, texts, autotexts = ax2.pie(pr_pie['Freq'], labels=pr_pie['Category'], autopct='%1.1f%%',
    startangle=90, colors=cols_pie[:len(pr_pie)],
    explode=[0.05 if i == len(pr_pie)-1 else 0 for i in range(len(pr_pie))])
for at in autotexts: at.set_fontweight('bold'), at.set_fontsize(9)
ax2.set_title('Low-score Complaint Distribution', fontsize=13, fontweight='bold')
plt.tight_layout(); plt.savefig('result/a9_root_cause.png'); plt.close()

# Frequency vs Severity
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))
freq_d = pr.sort_values('Freq', ascending=True)
sev_d = pr.sort_values('Impact', ascending=True)
ax1.barh(range(len(freq_d)), freq_d['FreqPct'], color=BA_DARK, edgecolor='white', height=0.6)
ax1.set_yticks(range(len(freq_d))); ax1.set_yticklabels(freq_d['Category'], fontsize=10)
ax1.set_xlabel('% of Low-score Reviews', fontsize=12); ax1.set_title('Frequency', fontsize=12, fontweight='bold')
for bar, pct in zip(ax1.containers[0], freq_d['FreqPct']):
    ax1.text(bar.get_width()+0.5, bar.get_y()+bar.get_height()/2., f'{pct:.1f}%', va='center', fontsize=9)
ax2.barh(range(len(sev_d)), sev_d['Impact'], color=RED, edgecolor='white', height=0.6)
ax2.set_yticks(range(len(sev_d))); ax2.set_yticklabels(sev_d['Category'], fontsize=10)
ax2.set_xlabel('Severity = 5 − AvgRating', fontsize=12); ax2.set_title('Severity', fontsize=12, fontweight='bold')
for bar, score in zip(ax2.containers[0], sev_d['Impact']):
    ax2.text(bar.get_width()+0.02, bar.get_y()+bar.get_height()/2., f'{score:.2f}', va='center', fontsize=9)
fig.suptitle('A9: Frequency vs Severity Analysis', fontsize=14, fontweight='bold')
plt.tight_layout(); plt.savefig('result/a9_freq_severity.png'); plt.close()

# ================================================================
# Yearly Heatmap (bonus from ss2)
# ================================================================
print("Bonus: Yearly-Monthly Heatmap")
ym = pd.read_csv('./data/a4_yearly_monthly.csv')
mo_order = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
piv = ym.pivot_table(values='AvgRating', index='FlightMonth', columns='FlightYear', aggfunc='mean').reindex(mo_order)

fig, ax = plt.subplots(figsize=(12, 7))
sns.heatmap(piv, annot=True, fmt='.1f', cmap='RdYlGn', center=5, ax=ax, linewidths=1, linecolor='white',
            annot_kws={'fontsize': 9}, cbar_kws={'label': 'Avg Rating'}, vmin=1, vmax=10)
ax.set_title('Year × Month Rating Heatmap (Green=Good, Red=Poor)', fontsize=14, fontweight='bold')
ax.set_xlabel('Year', fontsize=12); ax.set_ylabel('Month', fontsize=12)
plt.tight_layout(); plt.savefig('result/a4_yearly_heatmap.png'); plt.close()

# ================================================================
print('\n' + '='*60)
print(f'ALL {len([f for f in os.listdir("./result/") if f.endswith(".png")])} CHARTS GENERATED')
print('='*60)
for f in sorted(os.listdir('./result/')):
    if f.endswith('.png'):
        print(f'  - {f} ({os.path.getsize(f"./result/{f}")/1024:.1f} KB)')
