export interface NewsItem {
  slug: string;
  image: string;
  category: string;
  date: string;
  title: string;
  excerpt: string;
}

export const categoryStyles: Record<string, string> = {
  Infrastruktur: "bg-primary-container/90 text-on-primary-container",
  Ekonomi: "bg-secondary/90 text-white",
  Kesehatan: "bg-tertiary-container/90 text-on-tertiary-container",
  Pendidikan: "bg-secondary-fixed-dim/90 text-on-secondary-fixed-variant",
  Masyarakat: "bg-primary-container/90 text-on-primary-container",
};

export const categories = ["Semua", "Ekonomi", "Pendidikan", "Kesehatan", "Infrastruktur"];

export const newsItems: NewsItem[] = [
  {
    slug: "pembangunan-irigasi",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA3j1w_kAIkZAZNs3DjERDc1Uf58qKQv3meyvsAdPMA_HDXR-k8lrEhVqwOuiwVRA-HxwKfYwywepBo8SCZPT1yEwAbn_y4Nh1fKv5vaIwu6IQ_26-8K7orqRDNDw7ApxYW5CXAjmfc8LwdacO4vyQ7Vr-YFscfnecIHtvNF5Af5L0RdPgCyOgyRl6rKYuQLSBnPjIKOHrI-AKdv31mMVbUjOYf_ZLWeUR8EWzrrgp1Gux47LbhfwfmmJzeoc2JyeOjO4Wxq-JPKrw",
    category: "Infrastruktur",
    date: "20 Mei 2024",
    title: "Pembangunan Irigasi Baru Selesai Tepat Waktu",
    excerpt: "Proyek strategis pengairan sawah di wilayah Dusun Utara telah rampung, menjamin pasokan air bagi 50 hektar lahan pertanian...",
  },
  {
    slug: "panen-raya-organik",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCaGnv7_fym1BQ8YP1vaU9AaP43pVHzmh4G52VFawK5Op9Dh0a3Z4UFHLN4ZR30TlUQna22j1IBTZRtWjbahqnC27Pv0RTBw2Pj6zJGserdzzp-9P9FKd-3jWB7PrwrMkGMzJ-dGF_EyWWFzzM14S8OFX5iUdypJBIb2XpZedXw8qwvbB64oh0gjq0XBuy8RIbTc-LmekUyVtU4yZtvzgYKkc_-yECvzxtuanC8NCBtYz85xnIRb47tT0SFACMAGkPXIKEmfp0Qta8",
    category: "Ekonomi",
    date: "18 Mei 2024",
    title: "Panen Raya Padi Organik Meningkat 20%",
    excerpt: "Penggunaan pupuk organik mandiri mulai menunjukkan hasil signifikan pada hasil panen musim ini, meningkatkan kesejahteraan petani...",
  },
  {
    slug: "imunisasi-posyandu-anggrek",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9f5ltezy-AC2lU4q_wtmHw4GynU48GMM_WGGL26KKiQ4X2u9tYiZGjaDR3zuANnBDnrW6KfdZywlouhExcwG0ulh1GZoNOfUFxTFxfD1YObnxsu-cJbgzEWB2bys6MWOdl_BlY2T7Od_rAytjQLnyaTpfuMc_rAhJf6pSfWycbiYTjUpwxBbEXp04zSLjc40NChzCUiSiXz7Ao4c9fN-kxDDMye9dRLf6DVgxf_b9LC4TOpbuJjdlznsOlrQQoJHoEvn1YtdQdDw",
    category: "Kesehatan",
    date: "15 Mei 2024",
    title: "Jadwal Imunisasi Bulanan Posyandu Anggrek",
    excerpt: "Mari pastikan tumbuh kembang si buah hati dengan mengikuti jadwal imunisasi rutin yang akan dilaksanakan serentak di Balai Desa...",
  },
  {
    slug: "beasiswa-berprestasi",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBNaSrxlQlETs0101Q2KNa65WpXED0fjDKsdjApBb4fsGO26Bd1sAE-3QjRN98aVcsYvdGkPtU-YMG_96-J4NK8AhluZ45WNVS9_spT6DC_vux2__f9GMMpocHwbveOctMFrxD-nbG-Iy74AovL17MNyMR3pKKTTJ1uz09-AgAsqk1JeGZVWk7rPgmI3IcgHwfltWwxGbmFVVixkMmzEEcLSfuiH9b5Bid8xjxbPfAZKwe-1yaMVLV-cuah01Wszbc3drGEYnuT_BM",
    category: "Pendidikan",
    date: "12 Mei 2024",
    title: "Beasiswa Berprestasi Kembali Dibuka",
    excerpt: "Pemerintah Desa mengalokasikan dana pendidikan bagi siswa berprestasi dari keluarga kurang mampu untuk jenjang SMA dan Kuliah...",
  },
  {
    slug: "pelatihan-pemasaran-digital-umkm",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBA10VqMUYnyUvoFDF91K2itj68qLNX7Xn1ygupIcrrQ1IU53660V-r2KrHw8HP1KmZ1i68MWDFR41UiYa17Kv0jMuQmHbyROfODCbuCOQBSMvh7wFiLeXPXjHt5oAg0eq2TRiDWiTmdPnjkwQDaIsUNeooIQx70Cznu7pu7UlcLYPTemkPG2FIBBKdft-wzGAo6LWxMhReC1ORse-4q__Ns9HHwlUWeTPVNz3sVL13j7tLEKfurhFnkizt1pymR6ZVxZ1LXmwz5hM",
    category: "Ekonomi",
    date: "10 Mei 2024",
    title: "Pelatihan Pemasaran Digital bagi UMKM",
    excerpt: "Mendorong produk lokal menjangkau pasar nasional, Desa menyelenggarakan workshop optimasi marketplace bagi pengrajin lokal...",
  },
  {
    slug: "gerakan-sabtu-bersih",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAuJi0RQPzPjnlYsUkUNZBoKI5xIR3WLD7egWN9l-oceilNdjFlwN8aUvXinppjjSxucyD1J8KLUKQe0PHUr1HoIh7PNEUvNc07t3FigHIEO270D2PFZuCiTg4obk7n33c_iPw7R6neLvLwAEVRz3n8IKRT7YJfXKW-Ivd99SmYYH9W-jnUx1g6i08q-obkzTyP0DAJfCKkl-pcKT2Fh4FUROppZVfVWRYnN7ysZdGC6Uh7MArBZ2fdy8x5fJJHPgtI7YFxqCRl5sw",
    category: "Masyarakat",
    date: "08 Mei 2024",
    title: "Gerakan Sabtu Bersih di Lingkungan Desa",
    excerpt: "Menjaga kelestarian alam dan kebersihan lingkungan, warga secara antusias mengikuti kegiatan rutin gotong royong akhir pekan...",
  },
];
