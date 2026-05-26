import Link from 'next/link';
import TextType from './reactbits/Text-Type/TextType';
import { kelas } from './data/kelas';

export default function Menu() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-10">
      <img
        src="https://res.cloudinary.com/dhtfq9yw8/image/upload/v1717920310/uptd%20sdn%202%20kalimati/svg/vapqm0latukpxjjawzfu.svg"
        alt="logo-sekolah"
        className="lg:max-w-[20%] max-w-[35%] h-auto"
      />
      <h1 className="xl:text-7xl lg:text-5xl md:text-3xl text-2xl font-bold md:tracking-widest">
        <TextType
          text={[
            "Selamat Datang di",
            "UPTD SD Negeri 2 Kalimati",
            "Kecamatan Jatibarang",
          ]}
          typingSpeed={75}
          pauseDuration={1500}
          showCursor={true}
          cursorCharacter="|"
        />
      </h1>
      {/* <div className='card grid md:grid-cols-6 grid-cols-3 px-5 py-4 gap-5 rounded-lg shadow-lg items-center lg:text-lg font-medium'> */}
      {/* <div className='card flex px-5 py-4 gap-5 rounded-lg shadow-lg items-center lg:text-lg font-medium'> */}
      {/* {
          kelas.map((item) => (
            <Link key={item.href} href={item.href} className='class-card'>{item.label}</Link>
          ))
        } */}
      <Link
        href="/kelulusan"
        className="cursor-pointer flex items-center gap-1 border px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 duration-300 text-white dark:bg-blue-800 dark:hover:bg-blue-700 dark:border-blue-900 font-semibold tracking-widest"
      >
        Cek Kelulusan
      </Link>
      {/* </div> */}
    </div>
  );
}
