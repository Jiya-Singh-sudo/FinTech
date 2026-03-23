import axios from "axios";

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post("http://localhost:8000/predict", formData);
  return res.data;
};