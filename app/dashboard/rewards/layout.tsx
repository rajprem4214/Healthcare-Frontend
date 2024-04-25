import { Metadata } from 'next';
import RewardMenu from './menu';

export const metadata: Metadata = {
  title: 'Rewards',
  description: 'Rewards can be operated and viewed from here',
};
export default function RewardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <section>
        <div className="max-h-[120px] w-full">
          <RewardMenu />
        </div>
        {children}
      </section>
    </>
  );
}
