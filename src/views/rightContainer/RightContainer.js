import React, { useEffect, useRef, useState } from 'react'
import { Formik } from "formik";
import toast, { Toaster } from 'react-hot-toast';
import { useForm } from '../../hooks/useForm'
import TextInput from '../../components/textInput/TextInput'
import Button from '../../components/button/button';
import { getItemFromStorage, setItemInStorage, STORATE_KEYS } from '../../utils/storage';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { initializeApp } from 'firebase/app';
import { FaCopy, } from "react-icons/fa"

const RightContainer = () => {
    const [notification, setNotification] = useState({ title: '', body: '' });
    const [fcmToken, setFcmToken] = useState('');

    const formRef = useRef()
    const notify = () => toast(<ToastDisplay />);

    useEffect(() => {
        prepareAndInitializeFirebase();
        // navigator.serviceWorker.register('firebase-messaging-sw.js');
    }, []);



    const ToastDisplay = () => {
        return (
            <div>
                <p><b>{notification?.title}</b></p>
                <p>{notification?.body}</p>
            </div>
        )
    }

    useEffect(() => {
        if (notification?.title) {
            notify()
        }
    }, [notification])


    let createFirebaseAppAction = {
        apiKey: { id: "apiKey", label: "Api Key", value: "", validations: [{ isRequired: true }] },
        authDomain: { id: "authDomain", label: "Auth Domain", value: "", validations: [{ isRequired: true }] },
        projectId: { id: "projectId", label: "Project Id", value: "", validations: [{ isRequired: true }] },
        storageBucket: { id: "storageBucket", label: "Storage Bucket", value: "", validations: [{ isRequired: true }] },
        messagingSenderId: { id: "messagingSenderId", label: "Messaging Sender Id", value: "", validations: [{ isRequired: true }] },
        appId: { id: "appId", label: "App Id", value: "", validations: [{ isRequired: true }] },
        vapidKey: { id: "vapidKey", label: "Vapid Key", value: "", validations: [{ isRequired: true }] },
    }

    const prepareAndInitializeFirebase = () => {
        let result = getItemFromStorage(STORATE_KEYS.FIREBASE_CONFIG)
        if (result) {
            setFieldValue(createFirebaseAppAction.apiKey.id, result?.apiKey)
            setFieldValue(createFirebaseAppAction.authDomain.id, result?.authDomain)
            setFieldValue(createFirebaseAppAction.projectId.id, result?.projectId)
            setFieldValue(createFirebaseAppAction.storageBucket.id, result?.storageBucket)
            setFieldValue(createFirebaseAppAction.messagingSenderId.id, result?.messagingSenderId)
            setFieldValue(createFirebaseAppAction.appId.id, result?.appId)
            setFieldValue(createFirebaseAppAction.vapidKey.id, result?.vapidKey);
            initializeFirebase(result)

        }


    }

    const submitForm = (values) => {
        setItemInStorage(STORATE_KEYS.FIREBASE_CONFIG, values)
        window.location.reload(false);
    }

    const setFieldValue = (key, value) => {
        if (formRef.current) {
            formRef.current.setFieldValue(key, value)
        }
    }


    const initializeFirebase = (keys) => {
        let firebaseConfig = { ...keys };
        delete firebaseConfig.vapidKey
        initializeApp(firebaseConfig);

        const messaging = getMessaging();

        requestForToken(messaging, keys.vapidKey);
        onMessage(messaging, (payload) => {
            setNotification({ title: payload?.data?.title, body: payload?.data?.body });
        });
        // handleSendDataToServiceWorker(keys)
    }

    const handleSendDataToServiceWorker = (keys) => {
        if (navigator.serviceWorker) {

            // navigator.serviceWorker.register('firebase-messaging-sw.js');

            navigator.serviceWorker.addEventListener('message', event => {
                // event is a MessageEvent object
                console.log(`The service worker sent me a message: ${event.data}`);
            });

            navigator.serviceWorker.ready.then(registration => {
                registration.active.postMessage(JSON.stringify(keys));
            });

        }
    }

    const requestForToken = (messaging, vapidKey) => {
        return getToken(messaging, { vapidKey: vapidKey })
            .then((currentToken) => {
                if (currentToken) {
                    setFcmToken(currentToken);
                    console.log('current token for client: ', currentToken);
                    // Perform any other neccessary action with the token
                } else {
                    // Show permission request UI
                    console.log('No registration token available. Request permission to generate one.');
                }
            })
            .catch((err) => {
                console.log('An error occurred while retrieving token. ', err);
            });
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(fcmToken);
        setNotification({ title: "Action", body: "Copied FCM TOKEN TO CLIP BOARD" });
    }



    let { initialValues, schema } = useForm(createFirebaseAppAction)
    return (
        <>

            <Toaster />
            <div className='flex flex-1 flex-col'>

                <div className='flex flex-1 text-black-500 dark:text-gray-400 p-4 justify-center items-center bg-red' >
                    <Formik
                        innerRef={formRef}
                        initialValues={initialValues}
                        validationSchema={schema}
                        onSubmit={submitForm}>
                        {(formik) => {
                            const {
                                values,
                                handleChange,
                                handleSubmit,
                                errors,
                                touched
                            } = formik;
                            return (
                                <form className='flex flex-1 flex-col' >
                                    {
                                        fcmToken &&
                                        <div className='flex justify-center items-center text-black-500 dark:text-gray-400 text-center text-2xl font-extrabold'>
                                            FCM TOKEN : {fcmToken.substring(0, 8)}... <div style={{ cursor: 'pointer' }} onClick={handleCopy}><FaCopy /></div>
                                        </div>
                                    }
                                    <TextInput
                                        id={createFirebaseAppAction.apiKey.id}
                                        title={createFirebaseAppAction.apiKey.label}
                                        handleChange={handleChange}
                                        values={values}
                                        errors={errors}
                                        touched={touched}
                                    />
                                    <TextInput
                                        id={createFirebaseAppAction.authDomain.id}
                                        title={createFirebaseAppAction.authDomain.label}
                                        handleChange={handleChange}
                                        values={values}
                                        errors={errors}
                                        touched={touched}
                                    />
                                    <TextInput
                                        id={createFirebaseAppAction.projectId.id}
                                        title={createFirebaseAppAction.projectId.label}
                                        handleChange={handleChange}
                                        values={values}
                                        errors={errors}
                                        touched={touched}
                                    />
                                    <TextInput
                                        id={createFirebaseAppAction.storageBucket.id}
                                        title={createFirebaseAppAction.storageBucket.label}
                                        handleChange={handleChange}
                                        values={values}
                                        errors={errors}
                                        touched={touched}
                                    />
                                    <TextInput
                                        id={createFirebaseAppAction.messagingSenderId.id}
                                        title={createFirebaseAppAction.messagingSenderId.label}
                                        handleChange={handleChange}
                                        values={values}
                                        errors={errors}
                                        touched={touched}
                                    />
                                    <TextInput
                                        id={createFirebaseAppAction.appId.id}
                                        title={createFirebaseAppAction.appId.label}
                                        handleChange={handleChange}
                                        values={values}
                                        errors={errors}
                                        touched={touched}
                                    />
                                    <TextInput
                                        id={createFirebaseAppAction.vapidKey.id}
                                        title={createFirebaseAppAction.vapidKey.label}
                                        handleChange={handleChange}
                                        values={values}
                                        errors={errors}
                                        touched={touched}
                                    />
                                    <Button onClick={handleSubmit} />
                                </form>
                            )
                        }}
                    </Formik>

                </div>

            </div>
        </>
    )
}

export default RightContainer