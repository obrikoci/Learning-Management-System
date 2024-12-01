import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api/v1", 
  withCredentials: true, 
});

// request interceptor to attach the token to every request
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await API.get("/refresh-token");
        localStorage.setItem("token", data.accessToken); 
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return API(originalRequest);
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);


// Auth API Endpoints
export const registerUser = (data) => API.post("/registration", data);
export const activateUser = (data) => API.post("/activate-user", data);
export const loginUser = (data) => API.post("/login", data);
export const fetchUserDetails = () => API.get("/me");
export const updateUser = (data) => API.put("/update-info", data);
export const logoutUser = () => API.get("/logout");

// Course API Endpoints
export const fetchAllCourses = () => API.get("/get-courses");
export const fetchCourseDetails = (id) => API.get(`/courses/get-course/${id}`);
export const createCourse = (data) => API.post("/create-course", data);
export const editCourse = (id, data) => API.put(`/edit-course/${id}`, data);
export const enrollInCourse = (id) => API.post(`/enroll/${id}`);
export const getStudentCourses = (data) => API.get("/student/courses", data);
export const fetchCourseContent = (id) => API.get(`/get-course-content/${id}`);
export const addQuestion = (data) => API.put(`/add-question`, data);
export const addAnswer = (data) => API.put(`/add-answer`, data);

export default API;
