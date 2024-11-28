import DangerButton from '@/Components/DangerButton';
import Dropdown from '@/Components/Dropdown';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import SubTitle from '@/Components/SubTitle';
import TextInput from '@/Components/TextInput';
import Title from '@/Components/Title';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;
    const [modalState, setModalState] = useState(false);
    const [profilePic, setProfilePic] = useState(user.profile_pic_b64);

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    function handleFileChange(event) {
        const input = event.target;
        if (input && input.files?.length > 0) {
            const file = input.files[0]; // Get the selected file
            console.log('File selected:', file);

            // Create a FormData object
            const formData = new FormData();
            formData.append('profile_pic', file);

            // Send the file with Axios
            axios
                .post(route('profile.uploadpic'), formData)
                .then((response) => {
                    setProfilePic(response.data.profile_pic_b64);
                    console.log('Profile picture uploaded successfully');
                })
                .catch((error) => {
                    console.error(
                        'Failed to upload profile picture',
                        error.response?.data || error,
                    );
                });
        } else {
            console.log('No file selected');
        }
    }

    function uploadPhotoClick() {
        const input = document.getElementById('file-upload');
        if (input) {
            console.log('Uploading photo');
            input.click();
        }
    }

    function closeModal() {
        setModalState(false);
    }

    function confirmProfilePicDeletion() {
        setModalState(true);
    }

    function deleteProfilePic() {
        axios
            .post(route('profile.deletepic'))
            .then(() => {
                closeModal();
                setProfilePic(null);
            })
            .catch((error) => {
                console.error(
                    'Failed to delete profile picture',
                    error.response?.data || error,
                );
            });
    }

    return (
        <section className={className}>
            <header>
                <Title>Profile Information</Title>

                <SubTitle>
                    Update your account's profile information and email address.
                </SubTitle>
            </header>

            <div className="mt-4 flex flex-col space-y-2">
                <div className="h-32 w-32">
                    <img
                        id="profile-picture"
                        src={
                            profilePic
                                ? `data:image/png;base64,${profilePic}`
                                : '/assets/img/defaultuser.webp'
                        }
                        alt="Profile Picture"
                        title="Profile Picture"
                        className="h-full w-full rounded-full border border-gray-600 object-cover transition-opacity duration-300 ease-in-out hover:opacity-70"
                    />
                </div>
                <div className="sm:ms-6 sm:flex sm:items-center">
                    <div className="relative ms-3">
                        <Dropdown>
                            <Dropdown.Trigger>
                                <span className="inline-flex rounded-md">
                                    <button
                                        type="button"
                                        className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none dark:bg-gray-700 dark:text-white"
                                    >
                                        Edit
                                        <svg
                                            className="-me-0.5 ms-2 h-4 w-4"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </span>
                            </Dropdown.Trigger>

                            <Dropdown.Content>
                                <div
                                    className="block w-full cursor-pointer px-4 py-2 text-start text-sm leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:text-white dark:hover:bg-gray-500"
                                    onClick={uploadPhotoClick}
                                >
                                    Upload a photo
                                </div>

                                <button
                                    className="block w-full cursor-pointer px-4 py-2 text-start text-sm leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:text-white dark:hover:bg-gray-500"
                                    onClick={confirmProfilePicDeletion}
                                >
                                    Remove photo
                                </button>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </div>
            </div>

            <input
                id="file-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />

            <Modal show={modalState} onclose={closeModal}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                        Are you sure you want to reset your profile picture?
                    </h2>

                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                        This action cannot be undone.
                    </p>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>
                            Cancel
                        </SecondaryButton>

                        <DangerButton
                            className="ms-3"
                            onClick={deleteProfilePic}
                        >
                            Delete profile picture
                        </DangerButton>
                    </div>
                </div>
            </Modal>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">Saved.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
