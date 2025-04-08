import { headers } from 'next/headers';

import ClientDeviceProvider from '@/components/ClientDeviceProvider';
import { isMobileUserAgent } from '@/utils/device';

export default async function DeviceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  let isMobile = false;

  try {
    const userAgent = headersList.get('user-agent') || '';
    isMobile = isMobileUserAgent(userAgent);
  } catch (error) {
    console.error('Error accessing user-agent header:', error);
    isMobile = false;
  }

  return (
    <ClientDeviceProvider isMobile={isMobile}>{children}</ClientDeviceProvider>
  );
}
