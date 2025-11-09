import { Card, CardContent } from "../ui/card";
import { ArrowRight, Cpu, Network, HardDrive } from "lucide-react";
import { motion } from "framer-motion";

export default function SynapseArchitecture() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-400 mb-2">
          SYNAPSE System Architecture
        </h1>
        <p className="text-gray-400">
          A Unified AI-Assisted Blockchain Framework for IoT Data Management
        </p>
      </div>

      {/* Core Layered Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-5 items-center gap-4 mb-20">
        {/* IoT Device Layer */}
        <Card className="bg-gray-800 border border-blue-500 shadow-xl">
          <CardContent className="flex flex-col items-center p-4">
            <Cpu size={40} className="text-blue-400 mb-2" />
            <h2 className="text-lg font-semibold">IoT Device Layer</h2>
            <p className="text-sm text-gray-400 text-center">
              Sensors and smart devices generate raw data streams.
            </p>
          </CardContent>
        </Card>

        <motion.div
          animate={{ x: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ArrowRight size={40} className="text-blue-400" />
        </motion.div>

        {/* Edge Gateway Layer */}
        <Card className="bg-gray-800 border border-purple-500 shadow-xl">
          <CardContent className="flex flex-col items-center p-4">
            <Network size={40} className="text-purple-400 mb-2" />
            <h2 className="text-lg font-semibold">Edge Gateway Layer</h2>
            <p className="text-sm text-gray-400 text-center">
              Performs pre-validation, compression, and sends metrics to AI module.
            </p>
          </CardContent>
        </Card>

        <motion.div
          animate={{ x: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ArrowRight size={40} className="text-blue-400" />
        </motion.div>

        {/* Blockchain Layer */}
        <Card className="bg-gray-800 border border-pink-500 shadow-xl">
          <CardContent className="flex flex-col items-center p-4">
            <Cpu size={40} className="text-pink-400 mb-2" />
            <h2 className="text-lg font-semibold">Blockchain Core Layer</h2>
            <p className="text-sm text-gray-400 text-center">
              Adaptive DPoS consensus adjusts dynamically based on AI metrics.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* IPFS Layer */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6">
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ArrowRight
            size={40}
            className="text-blue-400 rotate-90 md:rotate-0"
          />
        </motion.div>

        <Card className="bg-gray-800 border border-teal-500 shadow-xl w-80">
          <CardContent className="flex flex-col items-center p-4">
            <HardDrive size={40} className="text-teal-400 mb-2" />
            <h2 className="text-lg font-semibold">IPFS Storage Layer</h2>
            <p className="text-sm text-gray-400 text-center">
              Stores encrypted IoT data off-chain; blockchain holds content hash (CID).
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AI Controller */}
      <div className="mt-16 text-center">
        <Card className="bg-gray-900 border border-violet-500 shadow-lg inline-block">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-violet-400 mb-2">
              SYNAPSE Controller Module
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto">
              The intelligent core that monitors latency, TPS, and CPU utilization, dynamically adjusting delegate count, block size, and validation frequency for optimal performance.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
