


// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import toast from "react-hot-toast";
// import axios from "axios";

// import {
//   TextField,
//   Button,
//   Stepper,
//   Step,
//   StepLabel,
//   StepConnector,
//   styled,
//   Avatar
// } from "@mui/material";
// import PersonIcon from "@mui/icons-material/Person";
// import RestaurantIcon from "@mui/icons-material/Restaurant";
// import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
// import "./Form.css";

// /* Zomato Red Connector */
// const RedConnector = styled(StepConnector)(() => ({
//   "& .MuiStepConnector-line": {
//     borderColor: "#e23744",
//     borderTopWidth: 4,
//     borderRadius: 2
//   }
// }));

// export default function MyForm() {
//   const steps = ["Restaurant Information", "Bank Details"];
//   const [step, setStep] = useState(1);
//   const [preview, setPreview] = useState(null);
//   const [submitting, setSubmitting] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     trigger,
//     setValue,
//     formState: { errors }
//   } = useForm();

//   const nextStep = async () => {
//     const valid = await trigger([
//       "restaurantName",
//       "city",
//       "address",
//       "openingTime",
//       "closingTime",
//       "phone",
//       "panCard",
//       "fssaiLicence",
//       "imageFile"
//     ]);

//     if (valid) setStep(2);
//     else toast.error("Please complete all required fields including image");
//   };

//   const onSubmit = async (data) => {
//   if (submitting) return;   // 🚫 Block multiple clicks
//   setSubmitting(true);

//   const token = localStorage.getItem("token");

//   if (!token || token === "null" || token === "undefined") {
//     toast.error("Session expired. Please login again.");
//     setSubmitting(false);
//     return;
//   }

//   try {
//     const headers = {
//       Authorization: `Bearer ${token}`
//     };

//     const fd = new FormData();
//     fd.append("restaurantName", data.restaurantName);
//     fd.append("city", data.city);
//     fd.append("address", data.address);
//     fd.append("phone", data.phone);
//     fd.append("panCard", data.panCard);
//     fd.append("fssaiLicence", data.fssaiLicence);
//     fd.append("openingTime", data.openingTime);
//     fd.append("closingTime", data.closingTime);
//     fd.append("image", data.imageFile);

//     // 1️⃣ Create restaurant
//     const restaurantRes = await axios.post(
//       "http://localhost:9092/restaurant-api/restaurants",
//       fd,
//       { headers }
//     );

//     const restaurantId = restaurantRes.data.id;  // 🔥 FIXED

//     // 2️⃣ Save bank details
//     const bankPayload = {
//       restaurantId,
//       accountHolderName: data.accName,
//       accountNumber: data.accNo,
//       ifscCode: data.ifsc,
//       branchAddress: data.branch
//     };

//     await axios.post(
//       "http://localhost:9092/restaurant-api/bank/add",
//       bankPayload,
//       { headers }
//     );

//     toast.success("Restaurant registered successfully");

//     // 🔥 Redirect to partner page
//     window.location.href = "/partner-register";

//   } catch (err) {
//     console.error(err);
//     toast.error(err.response?.data || "Registration failed");
//     setSubmitting(false);
//   }
// };

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";

import {
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  styled,
  Avatar
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import "./Form.css";

/* Zomato Red Connector */
const RedConnector = styled(StepConnector)(() => ({
  "& .MuiStepConnector-line": {
    borderColor: "#e23744",
    borderTopWidth: 4,
    borderRadius: 2
  }
}));

export default function MyForm() {
  const steps = ["Restaurant Information", "Bank Details"];
  const [step, setStep] = useState(1);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [restaurantId, setRestaurantId] = useState(null);

  const isEdit = new URLSearchParams(window.location.search).get("edit") === "true";

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    formState: { errors }
  } = useForm();

  /* ================= LOAD EXISTING DATA FOR ON_HOLD ================= */

  useEffect(() => {
    if (!isEdit) return;

    const token = localStorage.getItem("token");
    const payload = JSON.parse(atob(token.split(".")[1]));
    const email = payload.sub;

    axios
      .get(`http://localhost:9092/restaurant-api/partner/${email}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        const r = res.data[0];
        setRestaurantId(r.id);

        setValue("restaurantName", r.restaurantName);
        setValue("city", r.city);
        setValue("address", r.address);
        setValue("phone", r.phone);
        setValue("panCard", r.panCard);
        setValue("fssaiLicence", r.fssaiLicence);
        setValue("openingTime", r.openingTime);
        setValue("closingTime", r.closingTime);
        setPreview(r.imageUrl);

        return axios.get(`http://localhost:9092/restaurant-api/bank/${r.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      })
      .then(bank => {
        setValue("accName", bank.data.accountHolderName);
        setValue("accNo", bank.data.accountNumber);
        setValue("ifsc", bank.data.ifscCode);
        setValue("branch", bank.data.branchAddress);
      });
  }, []);

  const nextStep = async () => {
    const valid = await trigger([
      "restaurantName",
      "city",
      "address",
      "openingTime",
      "closingTime",
      "phone",
      "panCard",
      "fssaiLicence",
      !isEdit && "imageFile"
    ].filter(Boolean));

    if (valid) setStep(2);
    else toast.error("Please complete all required fields");
  };

  /* ================= SUBMIT ================= */
  const onSubmit = async (data) => {
    if (submitting) return;
    setSubmitting(true);

    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    try {
      /* ================= FIX MODE ================= */
      if (isEdit) {
        await axios.put(
          `http://localhost:9092/restaurant-api/restaurants/${restaurantId}`,
          {
            restaurantName: data.restaurantName,
            city: data.city,
            address: data.address,
            phone: data.phone,
            openingTime: data.openingTime,
            closingTime: data.closingTime
          },
          { headers }
        );

        await axios.put(
          `http://localhost:9092/restaurant-api/restaurants/${restaurantId}/bank`,
          {
            accountHolderName: data.accName,
            accountNumber: data.accNo,
            ifscCode: data.ifsc,
            branchAddress: data.branch
          },
          { headers }
        );

        toast.success("Changes submitted for verification");
        window.location.href = "/partner-status";
        return;
      }

  /* ================= SUBMIT ================= */

  // const onSubmit = async (data) => {
  //   if (submitting) return;
  //   setSubmitting(true);

  //   const token = localStorage.getItem("token");
  //   const headers = { Authorization: `Bearer ${token}` };

  //   try {
  //     // ================= ON_HOLD UPDATE =================
  //     if (isEdit) {
  //       await axios.put(
  //         `http://localhost:9092/restaurant-api/restaurants/${restaurantId}`,
  //         {
  //           restaurantName: data.restaurantName,
  //           city: data.city,
  //           address: data.address,
  //           phone: data.phone,
  //           openingTime: data.openingTime,
  //           closingTime: data.closingTime
  //         },
  //         { headers }
  //       );

  //       await axios.put(
  //         `http://localhost:9092/restaurant-api/restaurants/${restaurantId}/bank`,
  //         {
  //           accountHolderName: data.accName,
  //           accountNumber: data.accNo,
  //           ifscCode: data.ifsc,
  //           branchAddress: data.branch
  //         },
  //         { headers }
  //       );

  //       toast.success("Changes submitted for verification");
  //       window.location.href = "/partner-register";
  //       return;
  //     }

      // ================= FIRST TIME SUBMIT =================
      const fd = new FormData();
      fd.append("restaurantName", data.restaurantName);
      fd.append("city", data.city);
      fd.append("address", data.address);
      fd.append("phone", data.phone);
      fd.append("panCard", data.panCard);
      fd.append("fssaiLicence", data.fssaiLicence);
      fd.append("openingTime", data.openingTime);
      fd.append("closingTime", data.closingTime);
      fd.append("image", data.imageFile);

      const restaurantRes = await axios.post(
        "http://localhost:9092/restaurant-api/restaurants",
        fd,
        { headers }
      );

      const restaurantId = restaurantRes.data.id;

      await axios.post(
        "http://localhost:9092/restaurant-api/bank/add",
        {
          restaurantId,
          accountHolderName: data.accName,
          accountNumber: data.accNo,
          ifscCode: data.ifsc,
          branchAddress: data.branch
        },
        { headers }
      );

      toast.success("Restaurant registered successfully");
      window.location.href = "/partner-register";

    } catch (err) {
      toast.error(err.response?.data || "Submission failed");
      setSubmitting(false);
    }
  };


  return (
    <div className="zomato-form-page">
      <div className="zomato-bg"></div>

      <div className="wrapper-box">
        {/* ===== Stepper ===== */}
        <div className="stepper-wrapper">
          <Stepper
            activeStep={step - 1}
            alternativeLabel
            connector={<RedConnector />}
            sx={{
              "& .MuiStepIcon-root": { color: "#ffd7da" },
              "& .MuiStepIcon-root.Mui-active": { color: "#e23744" },
              "& .MuiStepIcon-root.Mui-completed": { color: "#e23744" },
              "& .MuiStepLabel-label.Mui-active": {
                color: "#e23744",
                fontWeight: 700
              }
            }}
          >
            {steps.map((label) => (
              <Step key={label}><StepLabel>{label}</StepLabel></Step>
            ))}
          </Stepper>

          <h3 className="form-heading">
            {step === 1 ? <RestaurantIcon /> : <AccountBalanceIcon />}
            {step === 1 ? "Restaurant Registration" : "Bank Details"}
          </h3>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="form-grid">

          {/* 🔥 Hidden register for image */}
          <input type="hidden" {...register("imageFile", { required: true })} />

          {/* ================= STEP 1 ================= */}
          {step === 1 && (
            <>
              <TextField
                label="Restaurant Name"
                error={!!errors.restaurantName}
                helperText={errors.restaurantName?.message}
                {...register("restaurantName", {
                  required: "Restaurant name is required",
                  minLength: { value: 3, message: "Minimum 3 characters" },
                  maxLength: { value: 50, message: "Maximum 50 characters" }
                })}
              />

              <TextField
                className="city"
                label="City"
                error={!!errors.city}
                helperText={errors.city?.message}
                {...register("city", {
                  required: "City is required",
                  minLength: { value: 3, message: "Minimum 3 characters" }
                })}
              />

              <TextField
                className="address"
                label="Address"
                error={!!errors.address}
                helperText={errors.address?.message}
                {...register("address", {
                  required: "Address is required",
                  minLength: { value: 10, message: "Minimum 10 characters" }
                })}
              />

              <TextField
                className="opening-time"
                type="time"
                label="Opening Time"
                InputLabelProps={{ shrink: true }}
                error={!!errors.openingTime}
                helperText={errors.openingTime?.message}
                {...register("openingTime", { required: "Required" })}
              />

              <TextField
                className="closing-time"
                type="time"
                label="Closing Time"
                InputLabelProps={{ shrink: true }}
                error={!!errors.closingTime}
                helperText={errors.closingTime?.message}
                {...register("closingTime", { required: "Required" })}
              />

              <TextField
                className="contact"
                label="Contact Number"
                error={!!errors.phone}
                helperText={errors.phone?.message}
                {...register("phone", {
                  required: "Phone is required",
                  pattern: {
                    value: /^[6-9]\d{9}$/,
                    message: "Enter valid 10-digit Indian number"
                  }
                })}
              />

              <TextField
                className="pan"
                label="PAN Card"
                error={!!errors.panCard}
                helperText={errors.panCard?.message}
                {...register("panCard", {
                  required: "PAN is required",
                  pattern: {
                    value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                    message: "Invalid PAN format (ABCDE1234F)"
                  }
                })}
              />

              {/* Upload */}
              <div className="upload-card">
                <div className="avatar-circle">
                  <Avatar src={preview || ""} sx={{ width: 90, height: 90 }}>
                    {!preview && <PersonIcon />}
                  </Avatar>
                </div>

                <label className="upload-btn">
                  Upload Photo
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;

                      if (file.size > 5 * 1024 * 1024) {
                        toast.error("Max file size 5MB");
                        return;
                      }

                      setPreview(URL.createObjectURL(file));
                      setValue("imageFile", file);
                    }}
                  />
                </label>

                <p className="upload-info">JPG or PNG, max 5MB</p>
              </div>

              <TextField
                className="fssai"
                label="FSSAI License"
                error={!!errors.fssaiLicence}
                helperText={errors.fssaiLicence?.message}
                {...register("fssaiLicence", {
                  required: "FSSAI number required",
                  pattern: {
                    value: /^[0-9]{14}$/,
                    message: "FSSAI must be 14 digits"
                  }
                })}
              />

              <div className="button-row">
                <Button className="primary-btn" onClick={nextStep}>
                  Next
                </Button>
              </div>
            </>
          )}

          {/* ================= STEP 2 ================= */}
          {step === 2 && (
            <>
              <TextField
                label="Account Holder Name"
                error={!!errors.accName}
                helperText={errors.accName?.message}
                {...register("accName", {
                  required: "Required",
                  minLength: { value: 3, message: "Minimum 3 characters" }
                })}
              />

              <TextField
                label="Account Number"
                error={!!errors.accNo}
                helperText={errors.accNo?.message}
                {...register("accNo", {
                  required: "Required",
                  minLength: { value: 9, message: "Min 9 digits" },
                  maxLength: { value: 18, message: "Max 18 digits" }
                })}
              />

              <TextField
                label="IFSC Code"
                error={!!errors.ifsc}
                helperText={errors.ifsc?.message}
                {...register("ifsc", {
                  required: "Required",
                  pattern: {
                    value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                    message: "Invalid IFSC format"
                  }
                })}
              />

              <TextField
                label="Branch Address"
                error={!!errors.branch}
                helperText={errors.branch?.message}
                {...register("branch", {
                  required: "Required",
                  minLength: { value: 5, message: "Too short" }
                })}
              />

              <div className="button-row">
                <Button className="secondary-btn" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button type="submit" className="primary-btn">
                  Submit
                </Button>
              </div>
            </>
          )}

        </form>
      </div>
    </div>
  );
}
