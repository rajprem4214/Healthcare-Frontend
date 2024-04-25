import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Patients | InuWell HealthCare',
  description: 'Enrolled patients can be view and modified from here.',
};

export default function PatientsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className="">{children}</section>;
}
