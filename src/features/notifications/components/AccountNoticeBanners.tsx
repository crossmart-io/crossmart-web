import { useAccountNotices } from '../hooks/useAccountNotices';
import { NoticeBanner } from './NoticeBanner';

/** Above every page: the notices that cannot wait for the bell. The bell lists them too. */
export function AccountNoticeBanners() {
  const banners = useAccountNotices().filter((notice) => notice.banner);
  if (banners.length === 0) return null;
  return (
    <div className="mb-6 flex flex-col gap-3">
      {banners.map((notice) => (
        <NoticeBanner key={notice.key} notice={notice} />
      ))}
    </div>
  );
}
