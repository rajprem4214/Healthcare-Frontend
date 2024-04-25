import { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'Notifications | InuWell HealthCare',
  description: 'All notifications can be viewed and modified from here.',
};

export default function NotificationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className="">
    {children}
  </section>;
}
