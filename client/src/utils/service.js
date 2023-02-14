import { toast } from "react-hot-toast";
export const host = "http://localhost:5000";
export const baseUrl = "http://localhost:5000/api";

export const postRequest = async (url, body) => {
  const response = await fetch(`${baseUrl}/${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });
  const data = await response.json();
  if (!response.ok) {
    toast.error(data.message);
    return;
  }
  return data;
};

export const getRequest = async (url) => {
  const response = await fetch(`${baseUrl}/${url}`);
  const data = await response.json();
  if (!response.ok) {
    toast.error(data.message);
    return;
  }
  return data;
};
