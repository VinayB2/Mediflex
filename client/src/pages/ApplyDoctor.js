import { Button, Col, Form, Input, Row, TimePicker } from "antd";
import { React, useState, useEffect } from "react";
import faceIO from "@faceio/fiojs";

import Layout from "../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DoctorForm from "../components/DoctorForm";
import moment from "moment";

function ApplyDoctor() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [faceio, setFaceio] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeFaceIO = async () => {
      try {
        const faceioInstance = new faceIO("fioa6e1f");
        setFaceio(faceioInstance);
      } catch (error) {
        setError("Failed to initialize FaceIO: " + error.message);
      }
    };
    initializeFaceIO();
  }, []);

  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/user/apply-doctor-account",
        {
          ...values,
          userId: user._id,
          timings: [
            moment(values.timings[0]).format("HH:mm"),
            moment(values.timings[1]).format("HH:mm"),
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        const res = await faceio.enroll({
          locale: "auto",
          payload: {
            email: response.email,
            _id: response._id,
          },
        });
        const faceId = res.facialId;
        console.log(faceId);
        axios
          .post(
            "/api/user/update-doctor-account",
            {
              id: user._id,
              faceID: faceId,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          )
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });

        toast.success(response.data.message);
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout>
      <h1 className="page-title">Apply Doctor</h1>
      <hr />

      <DoctorForm onFinish={onFinish} />
    </Layout>
  );
}

export default ApplyDoctor;
