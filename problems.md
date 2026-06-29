## Error Type
Console Error

## Error Message
React does not recognize the `isEntrance` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `isentrance` instead. If you accidentally passed it from a parent component, remove it from the DOM element.


    at path (<anonymous>:null:null)
    at activeBar (app/components/AttendanceBarChart.tsx:130:17)
    at AttendanceBarChart (app/components/AttendanceBarChart.tsx:116:11)
    at AdminDashboard (app/(admin)/dashboard/page.tsx:171:11)
    at Dashboard (app/(admin)/dashboard/page.tsx:30:10)

## Code Frame
  128 |               const r = 8;
  129 |               return (
> 130 |                 <path
      |                 ^
  131 |                   d={`M ${x} ${nb} L ${x} ${ny + r} Q ${x} ${ny} ${x + r} ${ny} L ${x + width - r} ${ny} Q ${x ...
  132 |                   className="bar-grow"
  133 |                   {...sanitizeDOMProps(rest)}

Next.js version: 16.2.6 (Turbopack)
