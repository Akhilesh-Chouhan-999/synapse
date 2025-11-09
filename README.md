# 🧠 SYNAPSE — AI-Assisted Blockchain Framework for IoT Data Management  

### 🔹 Overview  
**SYNAPSE** is a unified architecture that integrates **IoT, Blockchain, AI, and Distributed Storage (IPFS)** to provide intelligent, secure, and adaptive data management for IoT networks.  
The system automatically optimizes consensus parameters (block size, delegate count, validation frequency) based on live network analytics and AI feedback.

---

## 🏗️ System Architecture  

The architecture consists of **five primary layers**, each with a clear purpose and communication channel:

### 1️⃣ IoT Device Layer  
- Sensors and smart devices collect real-time data streams.  
- Data is transmitted to the Edge Gateway for pre-processing.  

### 2️⃣ Edge Gateway Layer  
- Performs **data validation, filtering, and compression**.  
- Sends metrics (TPS, latency, CPU usage) to the AI Controller.  

### 3️⃣ Blockchain Core Layer  
- Implements **Adaptive Delegated Proof of Stake (DPoS)** consensus.  
- Blockchain parameters are dynamically tuned using AI analytics.  

### 4️⃣ IPFS Storage Layer  
- IoT data is stored off-chain in **IPFS**.  
- Only content hashes (CIDs) are recorded on-chain for verification.  

### 5️⃣ AI Controller Module  
- Continuously monitors blockchain metrics like **latency**, **throughput**, and **node load**.  
- Adjusts system configurations in real-time for maximum efficiency and energy balance.  

---

## 🧩 Key Features  

✅ Real-time monitoring of IoT and blockchain nodes  
✅ Adaptive consensus controlled by AI  
✅ Secure off-chain storage via IPFS  
✅ Modular phase-based architecture for extensibility  
✅ Web-based dashboard for visualization and analysis  

---

## ⚙️ Technologies Used  

| Layer | Technologies / Tools |
|-------|-----------------------|
| IoT Simulation | Python, Flask, MQTT |
| Edge Gateway | Node.js, Express |
| Blockchain Core | Python (DPoS), Web3, Solidity (Prototype) |
| IPFS Storage | Infura IPFS API |
| AI Controller | Python, scikit-learn, TensorFlow-lite |
| Dashboard / UI | React.js, Vite, Tailwind CSS, Framer Motion, Lucide Icons |

---

## 🧱 Project Structure  

📦 synapse
┣ 📂 phase1_iot_simulation/
┣ 📂 phase2_edge/
┣ 📂 phase3_blockchain_core/
┣ 📂 phase4_ai_controller/
┣ 📂 phase6.7_research_analysis/
┣ 📂 synapse-backend/
┣ 📂 synapse-dashboard/
┗ 📂 ui/


---

## 🚀 How to Run Locally  

### Step 1 — Clone Repository  
```bash
git clone https://github.com/Akhilesh-Chouhan-999/synapse.git
cd synapse

Step 2 — Install Dependencies

(Inside the ui or other phase folders as needed)

npm install

Step 3 — Start Development Server
npm run dev

Step 4 — For Python Modules
cd phase4_ai_controller
python app.py

📊 Visual Representation

Synapse Architecture Diagram

🧑‍💻 Author

Akhilesh Chouhan
B.Tech Computer Science Engineering
Oriental Institute of Science and Technology, Bhopal

🔗 GitHub Profile

📧 akhileshchouhan999@gmail.com

🧭 Future Scope

Integration with live IoT sensor APIs

Full-fledged AI agent for blockchain parameter tuning

Multi-node blockchain deployment simulation

Real-world data layer monitoring with Grafana or Prometheus

🏁 License

This project is open-source under the MIT License.
