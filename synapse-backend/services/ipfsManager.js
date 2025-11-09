import axios from "axios";

export async function storeToIPFS({ hash, data }) {
  const response = await axios.post("http://localhost:5004/ipfs/store", { hash, data });
  return response.data;
}
