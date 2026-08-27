/**
 * Design: Long Nguyen personal image archive — the same compact, image-led profile acts as the shared identity above both browsing modes.
 */
import type { ArchiveProfile } from "@/lib/albumData";

type ArchiveProfileHeaderProps = {
  profile: ArchiveProfile;
  assetCount: number;
};

export function ArchiveProfileHeader({ profile, assetCount }: ArchiveProfileHeaderProps) {
  const cover = profile.cover?.trim();
  const avatar = profile.avatar?.trim();

  return <section className="profile-shell" aria-label={`Thông tin cá nhân của ${profile.name}`}>
    <div className="profile-cover">{cover && <img src={cover} alt={`Ảnh bìa của ${profile.name}`} fetchPriority="high" />}</div>
    <div className="profile-summary">
      <div className="profile-avatar">{avatar && <img src={avatar} alt={`Avatar ${profile.name}`} />}</div>
      <div className="profile-copy"><h1>{profile.name}</h1>{profile.handle && <p className="profile-handle">{profile.handle}</p>}{profile.bio && <p className="profile-bio">{profile.bio}</p>}</div>
      <div className="profile-stats" aria-label="Thống kê hình ảnh"><span><strong>{assetCount}</strong> Hình</span></div>
    </div>
  </section>;
}
