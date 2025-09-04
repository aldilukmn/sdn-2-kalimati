import Link from 'next/link';
import TextType from './reactbits/Text-Type/TextType';

export default function Home() {
  return (
    <div className='flex flex-col items-center justify-center gap-10 h-[100vh]'>
      <img src="https://res.cloudinary.com/dhtfq9yw8/image/upload/v1717920310/uptd%20sdn%202%20kalimati/svg/vapqm0latukpxjjawzfu.svg" alt="logo-sekolah" className='lg:max-w-[20%] max-w-[35%] h-auto' />
      <h1 className='xl:text-7xl lg:text-5xl md:text-3xl text-2xl font-bold tracking-widest'>
        <TextType 
          text={["Selamat Datang di", "UPTD SD Negeri 2 Kalimati", "Kecamatan Jatibarang"]}
          typingSpeed={75}
          pauseDuration={1500}
          showCursor={true}
          cursorCharacter="|"
        />
      </h1>
      <div className='bg-white flex px-5 py-4 gap-5 rounded-lg shadow-lg items-center'>
        <Link href={'kelas-1'} className='bg-blue-300 p-2 rounded-lg transition-all duration-200 ease-in-out hover:-translate-y-1 hover:scale-110'>Kelas 1</Link>
        <Link href={'kelas-2'}>Kelas 2</Link>
        <Link href={'kelas-3'}>Kelas 3</Link>
        <Link href={'kelas-4'}>Kelas 4</Link>
        <Link href={'kelas-5'}>Kelas 5</Link>
        <Link href={'kelas-6'}>Kelas 6</Link>
      </div>
    </div>
  );
}
