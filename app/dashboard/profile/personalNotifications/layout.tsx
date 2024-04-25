import { Metadata } from 'next';


export const metadata: Metadata = {
    title: 'Personal Notifications | InuWell HealthCare',
    description: 'Perosnal Notifications can be viewed and modified from here.',
};

export default function PerosnalNotificationsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <section className="">
        {children}
    </section>;
}
