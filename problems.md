## Error Type
Runtime TypeError

## Error Message
Cannot read properties of undefined (reading 'charAt')


    at ProfileView (app/(admin)/profil/ProfileView.tsx:66:37)
    at MyProfilePage (app/(admin)/profil/page.tsx:6:10)

## Code Frame
  64 |
  65 |   const avatarUrl = previewUrl || profile.image_url;
> 66 |   const initials = profile.fullName.charAt(0).toUpperCase();
     |                                     ^
  67 |   const roleColor = ROLE_COLORS[profile.role] || "bg-slate-400";
  68 |   const canEdit = isSelf && userRole === profile.role;
  69 |

Next.js version: 16.2.10 (Turbopack)
