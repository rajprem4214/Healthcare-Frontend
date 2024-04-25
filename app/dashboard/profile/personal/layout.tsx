import { Metadata } from 'next';


export const metadata: Metadata = {
    title: 'Profile | InuWell HealthCare',
    description: 'Profile Data can be viewed and modified from here.',
};

export default function PersonalProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <section className="">
        {children}
    </section>;
}
