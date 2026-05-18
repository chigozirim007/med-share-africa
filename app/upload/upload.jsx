"use client";
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { FaRegPaperPlane } from "react-icons/fa";
import { Theme } from "@/components/Theme";
import * as Yup from 'yup';
import { collection, addDoc } from "firebase/firestore";
import { db } from '@/config/firebase';
import { FiLoader } from "react-icons/fi";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { FaRegThumbsUp } from "react-icons/fa";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};


export default function UploadClient({ session }) {
    const [processing, setProcessing] = useState(false)
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    const iv = {
        tip: "",
        desc: "",
        cat: ""
    };

    const valSchema = Yup.object({
        tip: Yup.string().required("Health tip is required"),
        desc: Yup.string().required("Provide a valid description"),
        cat: Yup.string().required("Select a valid category")
    });

    return (
        <main className="min-h-dvh py-12 px-6">
            <div className="max-w-2xl mx-auto">
                {/* Header Text */}
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-black mb-3">
                        Share a <span style={{ color: Theme.primaryGreen }}>Health Tip</span>
                    </h1>
                    <p className="text-slate-500 font-light">
                        Contribute to the community by sharing reliable medical knowledge.
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
                    <Formik
                        initialValues={iv}
                        validationSchema={valSchema}
                        onSubmit={async (values, { resetForm }) => {
                            try {
                                setProcessing(true)
                                const dbObject = {
                                    ...values,
                                    author: session?.user?.name || "Verified Strategist",
                                    authorImg: session?.user?.image || "",
                                    refId: session?.user?.id || "anonymous",
                                    timestamp: new Date().toLocaleDateString()
                                }

                                await addDoc(collection(db, "health-tips"), dbObject)
                                resetForm()
                                handleOpen()

                                // console.log(dbObject);
                            } catch (error) {
                                console.error("An error occurred", error)
                                alert("Something went wrong")
                            } finally {
                                setProcessing(false)
                            }
                        }}
                    >
                        {({ errors, touched }) => (
                            <Form className="flex flex-col gap-8">
                                {/* Tip Title */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Health Tip Title</label>
                                    <Field
                                        name="tip"
                                        placeholder="e.g. Importance of Vitamin D"
                                        className={`w-full px-5 py-4 rounded-2xl border transition-all focus:outline-none focus:ring-2 bg-slate-50 ${errors.tip && touched.tip ? 'border-red-400' : 'border-slate-200'
                                            }`}
                                        style={{ '--tw-ring-color': Theme.primaryGreen }}
                                    />
                                    <ErrorMessage component="p" className="text-red-500 text-xs font-bold ml-1" name="tip" />
                                </div>

                                {/* Category Select */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Category</label>
                                    <div className="relative">
                                        <Field
                                            name="cat"
                                            as="select"
                                            className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 bg-slate-50 appearance-none cursor-pointer"
                                            style={{ '--tw-ring-color': Theme.primaryGreen }}
                                        >
                                            <option value="" disabled>Select a category</option>
                                            <option value="cardio">Cardio</option>
                                            <option value="neuro">Neuro</option>
                                            <option value="dermal">Dermal</option>
                                            <option value="ent">ENT</option>
                                            <option value="radiography">Radiography</option>
                                            <option value="dentistry">Dentistry</option>
                                            <option value="haematology">Haematology</option>
                                            <option value="other">Other</option>
                                        </Field>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-slate-400">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                        </div>
                                    </div>
                                    <ErrorMessage component="p" className="text-red-500 text-xs font-bold ml-1" name="cat" />
                                </div>

                                {/* Description Textarea */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Content / Description</label>
                                    <Field
                                        name="desc"
                                        as="textarea"
                                        rows="5"
                                        placeholder="Provide detailed health information here..."
                                        className={`w-full px-5 py-4 rounded-2xl border transition-all focus:outline-none focus:ring-2 bg-slate-50 resize-none ${errors.desc && touched.desc ? 'border-red-400' : 'border-slate-200'
                                            }`}
                                        style={{ '--tw-ring-color': Theme.primaryGreen }}
                                    />
                                    <ErrorMessage component="p" className="text-red-500 text-xs font-bold ml-1" name="desc" />
                                </div>

                                {/* Submit Button */}
                                <button
                                    disabled={processing}
                                    type="submit"
                                    className="w-full md:w-max md:self-end flex items-center justify-center gap-3 py-4 px-10 rounded-full text-white font-black text-lg transition-transform active:scale-95 shadow-lg"
                                    style={{ backgroundColor: Theme.primaryGreen }}
                                >
                                    {
                                        processing ? <FiLoader className="text-2xl animate-spin" /> : <span className="flex items-center gap-2">
                                            Post Tip <FaRegPaperPlane className="text-sm" />
                                        </span>
                                    }

                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>

                {/* Back Link */}
                <p className="text-center mt-10 text-slate-400 text-sm italic">
                    All submissions are reviewed for community safety.
                    <button className="ml-2 font-bold underline" style={{ color: Theme.secondaryGreen }}>Learn more</button>
                </p>
            </div>
            <div>
                {/* <button onClick={handleOpen}>Open modal</button> */}
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            <FaRegThumbsUp />
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }} className='text-center'>
                            Health tip submitted successfully 
                        </Typography>
                    </Box>
                </Modal>
            </div>
        </main>
    );
}