import axios from "axios";
import { useDidMount } from "@/hooks";
import React, { useEffect, useState } from "react";
import { ArrowRightOutlined, LoadingOutlined } from '@ant-design/icons';
import { SocialLogin } from '@/components/common';
import { CustomInput } from '@/components/formik';
import { FORGOT_PASSWORD, SIGNUP, HOME, SIGNIN } from '@/constants/routes';
import { Field, Form, Formik } from 'formik';
import { useDocumentTitle, useScrollTop } from '@/hooks';
import PropType from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { setAuthenticating, setAuthStatus } from '@/redux/actions/miscActions';
import * as Yup from 'yup';

const Marketing = () => {
    const [value, setValue] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const didMount = useDidMount(true);

    const getData = (form) => {
        console.log(form)
        // e.preventDefault()
        setLoading(true);
        setError("");
        axios
            .post(`http://localhost:8000/api/marketing/`,
                { ...form }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            .then(({ data }) => {
                console.log(data)
                if (data.status) {
             
                    if (didMount) {
                        setValue(data.message);
                        setLoading(false);
                    }
                }
            })
            .catch((err) => setError("Error"));
    };



    // hooks test

    const handleChange = (e) => {
        updateFormData({
            ...formData,
            [e.target.name]: e.target.value.trim(),
        });
        console.log(formData)
    };
    const MarketingSchema = Yup.object().shape({
        NameProduct: Yup.string()
            .required('Name is required.'),
            Duration: Yup.number()
            .required('Duration is required.')
    });


    return (
        <>

            <div className="auth-content">


                <>

                    <div className={`auth`} style={{marginTop:"20px"}}>
                        <div className="auth-main">
                            <h3>Marketing Plan</h3>
                            <br />
                            <div className="auth-wrapper" >
                                <Formik
                                    initialValues={{
                                        NameProduct: '',
                                        Duration: ''
                                    }}
                                    validateOnChange
                                    validationSchema={MarketingSchema}
                                    onSubmit={getData}
                                >
                                    {() => (
                                        <Form>
                                            <div className="auth-field">
                                                <Field
                                                    disabled={false}
                                                    name="NameProduct"
                                                    type="text"
                                                    label="Name of product"
                                                    placeholder="Adidas"
                                                    component={CustomInput}
                                                />
                                            </div>
                                            <div className="auth-field">
                                                <Field
                                                    name="Duration"
                                                    type="number"
                                                    label="Duration"
                                                    placeholder="7"
                                                    component={CustomInput}
                                                />
                                            </div>
                                            <br />
                                            <button
                                                className="button auth-button"
                                                // disabled={isAuthenticating}
                                                type="submit"
                                            >
                                              Done
                                                &nbsp;
                                                <ArrowRightOutlined />
                                            </button>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        </div>

                    </div>

                </>

            </div>
            {error && !isLoading ? (
                <p>Try Again</p>
            ) : error && isLoading ?
                (<>  <h5 className="text-center toast-error">
                    Error
                </h5>

                </>) :
                isLoading ? (
                    <LoadingOutlined />
                ) : value && (
                    <>
                        <div className="" role="alert">
                            <div className="flex p-4">
                                
                       <pre> {value} </pre> 

            
                            </div>
                        </div>
                    </>
                )}
        </>
    )
}

export default Marketing