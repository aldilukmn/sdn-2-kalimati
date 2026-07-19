interface Siswa {
  nisn: string;
  nama: string;
  kelas: string;
}

export const dataSiswa: Siswa[] = [
  { nisn: "3143101958", nama: "Siti Khoriyah", kelas: "1" },
  { nisn: "3133412297", nama: "Afra Nayla Arkana", kelas: "1" },
  { nisn: "3147713644", nama: "Putri Amelia", kelas: "1" },
  { nisn: "3141417080", nama: "Rifaldi Saputra", kelas: "1" },
  { nisn: "0149413358", nama: "Laura Marga Retha", kelas: "1" },
  { nisn: "0148300301", nama: "Nayla Rosy", kelas: "1" },
  { nisn: "0132657173", nama: "Zalza Azzahra", kelas: "1" },
  { nisn: "3138861883", nama: "Ayyash Qeis Abymael", kelas: "1" },
  { nisn: "3140152010", nama: "Abdullah Fiqih", kelas: "1" },
  { nisn: "3150473887", nama: "Dhafitha Talita Zahra", kelas: "1" },

  { nisn: "0146242263", nama: "Chandy Rahmat", kelas: "2" },
  { nisn: "3141681669", nama: "Silvina Mahgdalena", kelas: "2" },
  { nisn: "3131814811", nama: "Zahratun Nisa", kelas: "2" },
  { nisn: "3140518274", nama: "Panzi Kusuma Putra Mulya", kelas: "2" },
  { nisn: "3132558553", nama: "Fifi Jannuba Arifah", kelas: "2" },
  { nisn: "3134284332", nama: "Lutfi Ardiansyah Syamsuri", kelas: "2" },
  { nisn: "3130246982", nama: "Haiqal Afrizal Sofyan", kelas: "2" },
  { nisn: "3133559964", nama: "Al Jefri", kelas: "2" },
  { nisn: "3142726268", nama: "Badriyya Shaliha Abdulloh", kelas: "2" },
  { nisn: "3144357617", nama: "Rafika Rahmawati", kelas: "2" },

  { nisn: "3145352175", nama: "Abdul Kharis", kelas: "3" },
  { nisn: "3146012345", nama: "Aisha Nurul Fadhilah", kelas: "3" },
  { nisn: "3146123456", nama: "Bima Sakti Wardhana", kelas: "3" },
  { nisn: "3146234567", nama: "Citra Dewi Lestari", kelas: "3" },
  { nisn: "3146345678", nama: "Dimas Anggara Putra", kelas: "3" },
  { nisn: "3146456789", nama: "Elsa Fitriani", kelas: "3" },
  { nisn: "3146567890", nama: "Fajar Nugroho", kelas: "3" },
  { nisn: "3146678901", nama: "Gita Permata Sari", kelas: "3" },
  { nisn: "3146789012", nama: "Hendra Gunawan", kelas: "3" },
  { nisn: "3146890123", nama: "Indah Wahyuni", kelas: "3" },

  { nisn: "3146901234", nama: "Joko Susilo", kelas: "4" },
  { nisn: "3147012345", nama: "Kartika Sari Dewi", kelas: "4" },
  { nisn: "3147123456", nama: "Lukman Hakim", kelas: "4" },
  { nisn: "3147234567", nama: "Mutiara Hati", kelas: "4" },
  { nisn: "3147345678", nama: "Nanda Pratama", kelas: "4" },
  { nisn: "3147456789", nama: "Olivia Puspita", kelas: "4" },
  { nisn: "3147567890", nama: "Prabowo Setiawan", kelas: "4" },
  { nisn: "3147678901", nama: "Ratna Kusuma", kelas: "4" },
  { nisn: "3147789012", nama: "Sandy Pradana", kelas: "4" },
  { nisn: "3147890123", nama: "Tia Anggraeni", kelas: "4" },

  { nisn: "3147901234", nama: "Ujang Komarudin", kelas: "5" },
  { nisn: "3148012345", nama: "Vina Amalia", kelas: "5" },
  { nisn: "3148123456", nama: "Wahyu Pratama", kelas: "5" },
  { nisn: "3148234567", nama: "Xaviera Putri", kelas: "5" },
  { nisn: "3148345678", nama: "Yoga Pratama", kelas: "5" },
  { nisn: "3148456789", nama: "Zaskia Adinda", kelas: "5" },
  { nisn: "3148567890", nama: "Ahmad Rizki", kelas: "5" },
  { nisn: "3148678901", nama: "Bella Safira", kelas: "5" },
  { nisn: "3148789012", nama: "Cahya Bintang", kelas: "5" },
  { nisn: "3148890123", nama: "Dian Permata", kelas: "5" },

  { nisn: "3148901234", nama: "Eko Prasetyo", kelas: "6" },
  { nisn: "3149012345", nama: "Fitri Handayani", kelas: "6" },
  { nisn: "3149123456", nama: "Gilang Ramadhan", kelas: "6" },
  { nisn: "3149234567", nama: "Hana Sofiana", kelas: "6" },
  { nisn: "3149345678", nama: "Irfan Maulana", kelas: "6" },
  { nisn: "3149456789", nama: "Jasmine Azzahra", kelas: "6" },
  { nisn: "3149567890", nama: "Kevin Pratama", kelas: "6" },
  { nisn: "3149678901", nama: "Larasati Dewi", kelas: "6" },
  { nisn: "3149789012", nama: "Maulana Malik", kelas: "6" },
  { nisn: "3149890123", nama: "Nadia Safitri", kelas: "6" },
];

export const getSiswaByKelas = (kelas: string): Siswa[] =>
  dataSiswa.filter((s) => s.kelas === kelas);

export const getSiswaByNisn = (nisn: string): Siswa | undefined =>
  dataSiswa.find((s) => s.nisn === nisn);

export const daftarKelas = [
  "1", "2", "3", "4", "5", "6"
];
