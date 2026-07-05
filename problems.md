## Error Type
Build Error

## Error Message
Return statement is not allowed here

## Build Output
./app/(admin)/layout.tsx:33:3
Return statement is not allowed here
  31 |   }
  32 |
> 33 |   return (
     |   ^^^^^^^
> 34 |     <DashboardShell userRole={userRole} userName={userName} userGrade={userGrade}>
     | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
> 35 |       {children}
     | ^^^^^^^^^^^^^^^^
> 36 |     </DashboardShell>
     | ^^^^^^^^^^^^^^^^^^^^^
> 37 |   );
     | ^^^^
  38 | }
  39 |

Parsing ecmascript source code failed

Next.js version: 16.2.6 (Turbopack)
