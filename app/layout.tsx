'use client';
import './globals.css';
import { store } from './redux/store';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { Nunito } from 'next/font/google';
import 'react-toastify/ReactToastify.css';

const nunito = Nunito({
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-Us">
      <body className={nunito.className}>
        <Provider store={store}>
          <ToastContainer position="bottom-right" />
          {children}
        </Provider>
      </body>
    </html>
  );
}
