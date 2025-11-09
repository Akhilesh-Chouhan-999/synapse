import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# === Load data ===
df = pd.read_csv("performance_metrics.csv")

# Convert timestamps from ms → seconds (relative to start)
df["time_s"] = (df["timestamp"] - df["timestamp"].min()) / 1000

# === Separate event types ===
edges = df[df["eventType"] == "EDGE_VALIDATED"].copy()
blocks = df[df["eventType"] == "BLOCK_ADDED"].copy()

# === Compute TPS ===
if len(blocks) > 1:
    blocks = blocks.sort_values("time_s")
    blocks["delta"] = blocks["time_s"].diff().fillna(0.001)
    blocks["tps"] = 1 / blocks["delta"]
else:
    blocks["tps"] = 0

# === Compute Average Latency ===
avg_latency = edges["latency"].mean().round(2)
avg_tps = blocks["tps"].mean().round(2)
print(f"Average TPS: {avg_tps} | Average Latency: {avg_latency} ms")

# === Plot 1: TPS over time ===
plt.figure(figsize=(10, 5))
sns.lineplot(x="time_s", y="tps", data=blocks, color="blue", marker="o")
plt.title("Synapse Blockchain Throughput (TPS) over Time")
plt.xlabel("Time (s)")
plt.ylabel("Transactions per Second (TPS)")
plt.grid(True)
plt.savefig("tps_over_time.png", dpi=200)
plt.close()

# === Plot 2: Latency over time ===
plt.figure(figsize=(10, 5))
sns.lineplot(x="time_s", y="latency", data=edges, color="orange", marker="o")
plt.title("Edge Validation Latency over Time")
plt.xlabel("Time (s)")
plt.ylabel("Latency (ms)")
plt.grid(True)
plt.savefig("latency_over_time.png", dpi=200)
plt.close()

# === Plot 3: TPS vs Latency correlation ===
# === Plot 3: TPS vs Latency correlation ===
if len(blocks) and len(edges):
    # Sort both dataframes by time
    blocks = blocks.sort_values("time_s").reset_index(drop=True)
    edges = edges.sort_values("time_s").reset_index(drop=True)

    # Merge based on nearest timestamp
    merged = pd.merge_asof(
        blocks, edges, on="time_s", direction="nearest", suffixes=("_block", "_edge")
    )

    # Check if merged has latency values
    if "latency" not in merged.columns:
        print("⚠️ No latency column found after merge — skipping correlation plot.")
    else:
        plt.figure(figsize=(6, 6))
        sns.scatterplot(
            x="tps",
            y="latency",
            data=merged,
            color="purple",
            s=60,
            alpha=0.7,
            edgecolor="black"
        )
        plt.title("TPS vs Latency Correlation")
        plt.xlabel("Transactions per Second (TPS)")
        plt.ylabel("Latency (ms)")
        plt.grid(True)
        plt.savefig("tps_vs_latency.png", dpi=200)
        plt.close()
        print("✅ tps_vs_latency.png created successfully!")
else:
    print("⚠️ Not enough data for correlation plot.")
