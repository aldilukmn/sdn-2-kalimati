## Error Type
Runtime Error

## Error Message
Base UI: SelectGroupContext is missing. SelectGroup parts must be placed within <Select.Group>.


    at SelectLabel (components/ui/select.tsx:103:5)
    at PresensiMuridPage (app/(admin)/presensi-murid/page.tsx:316:19)

## Code Frame
  101 | }: SelectPrimitive.GroupLabel.Props) {
  102 |   return (
> 103 |     <SelectPrimitive.GroupLabel
      |     ^
  104 |       data-slot="select-label"
  105 |       className={cn("px-1.5 py-1 text-xs text-muted-foreground", className)}
  106 |       {...props}

Next.js version: 16.2.6 (Turbopack)
