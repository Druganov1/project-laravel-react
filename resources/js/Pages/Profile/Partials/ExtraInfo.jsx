import InputLabel from '@/Components/InputLabel';
import SubTitle from '@/Components/SubTitle';
import TextInput from '@/Components/TextInput';
import Title from '@/Components/Title';
import { usePage } from '@inertiajs/react';

export default function ExtraInfo({ className = '' }) {
    const user = usePage().props.auth.user;

    return (
        <section className={className}>
            <header>
                <Title>Account settings</Title>
                <SubTitle>Extra info regarding your profile.</SubTitle>
            </header>

            <div className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="ip" value="Last logged in IP" />
                    <TextInput
                        id="ip"
                        type="text"
                        className="mt-1 block w-full disabled:bg-slate-200"
                        value={user.last_logged_in_ip}
                        disabled
                    />
                </div>

                {user.last_changed_password && (
                    <div>
                        <InputLabel
                            htmlFor="pass"
                            value="Last changed password date"
                        />
                        <TextInput
                            id="pass"
                            type="text"
                            className="mt-1 block w-full disabled:bg-slate-200"
                            value={new Date(
                                user.last_changed_password,
                            ).toLocaleDateString('nl-NL', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                            disabled
                        />
                    </div>
                )}
            </div>
        </section>
    );
}
