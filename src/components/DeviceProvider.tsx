import { headers } from 'next/headers';

import ClientDeviceProvider from '@/components/ClientDeviceProvider';
import { isMobileUserAgent } from '@/utils/device';

export default async function DeviceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  const isMobile = isMobileUserAgent(userAgent);

  return (
    <ClientDeviceProvider isMobile={isMobile}>{children}</ClientDeviceProvider>
  );
}
