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
    </div>
  );
}
