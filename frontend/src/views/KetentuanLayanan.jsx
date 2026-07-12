import React from 'react';
import { Scale, FileText, AlertCircle, UserCheck, Ban, DollarSign, MessageSquare, Globe, Lock, Mail, Cpu } from 'lucide-react';

const sections = [
  {
    icon: FileText,
    title: '1. Penerimaan Ketentuan',
    content: 'Dengan mengakses dan/atau menggunakan platform Perintis ("Layanan"), Anda menyatakan telah membaca, memahami, dan menyetujui untuk terikat oleh seluruh Ketentuan Layanan ini. Jika Anda tidak menyetujui salah satu atau seluruh ketentuan ini, Anda tidak diperkenankan menggunakan Layanan. Ketentuan ini dibuat berdasarkan dan tunduk pada hukum Negara Kesatuan Republik Indonesia, termasuk Undang-Undang Nomor 11 Tahun 2008 tentang Informasi dan Transaksi Elektronik ("UU ITE") beserta perubahannya, dan Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi ("UU PDP").',
  },
  {
    icon: UserCheck,
    title: '2. Syarat Pengguna',
    content: 'Pengguna Layanan wajib: (a) Berusia minimal 17 (tujuh belas) tahun atau telah menikah sesuai ketentuan peraturan perundang-undangan Indonesia; (b) Memiliki kapasitas hukum untuk mengikatkan diri dalam perjanjian yang sah; (c) Mendaftar dengan data yang benar, akurat, dan terkini; (d) Bertanggung jawab penuh atas kerahasiaan kredensial akun (email dan kata sandi); (e) Tidak menggunakan Layanan untuk tujuan ilegal, penipuan, atau yang melanggar hukum; (f) Tidak menyebarkan konten yang bersifat SARA, pornografi, ujaran kebencian, atau melanggar kesusilaan sesuai UU ITE.',
  },
  {
    icon: Cpu,
    title: '3. Deskripsi Layanan',
    content: 'Perintis adalah platform intelijen bisnis digital yang menyediakan: (a) Validasi ide bisnis berbasis kecerdasan buatan (AI Business Validator); (b) Informasi harga komoditas pangan terkini (Pantau Harga); (c) Simulasi keuangan meliputi HPP, BEP, Margin, dan ROI (Kalkulator & Proyeksi ROI); (d) Forum diskusi terbuka untuk komunitas UMKM; (e) Panduan dan referensi bisnis. Hasil analisis AI bersifat informatif dan tidak dapat dijadikan sebagai satu-satunya dasar pengambilan keputusan bisnis. Keputusan investasi dan usaha tetap sepenuhnya berada di tangan Pengguna.',
  },
  {
    icon: DollarSign,
    title: '4. Biaya Layanan',
    content: 'Saat ini, seluruh fitur dasar Perintis disediakan secara gratis (free-to-use). Kami berhak untuk memberlakukan biaya berlangganan atau biaya transaksional di masa mendatang dengan pemberitahuan terlebih dahulu kepada Pengguna. Setiap perubahan biaya akan diumumkan melalui platform dan/atau email terdaftar minimal 30 (tiga puluh) hari kalender sebelum berlaku efektif. Dengan terus menggunakan Layanan setelah perubahan biaya, Anda dianggap menyetujui ketentuan biaya yang baru.',
  },
  {
    icon: Scale,
    title: '5. Kekayaan Intelektual',
    content: 'Seluruh konten, desain, logo, merek, kode sumber, algoritma, database, dan materi lain yang terdapat dalam platform Perintis dilindungi oleh Undang-Undang Nomor 28 Tahun 2014 tentang Hak Cipta dan Undang-Undang Nomor 20 Tahun 2016 tentang Merek dan Indikasi Geografis. Pengguna dilarang: (a) Menyalin, memodifikasi, mendistribusikan, menjual, atau menyewakan sebagian atau seluruh platform tanpa izin tertulis; (b) Melakukan rekayasa balik (reverse engineering), pembongkaran, atau dekompilasi terhadap kode sumber; (c) Menggunakan robot, spider, scraper, atau alat otomatis lainnya untuk mengakses data platform.',
  },
  {
    icon: Ban,
    title: '6. Larangan dan Pembatasan',
    content: 'Pengguna dilarang keras untuk: (a) Melanggar hukum Indonesia, termasuk namun tidak terbatas pada UU ITE dan UU PDP; (b) Mengirimkan spam, phishing, malware, virus, atau kode berbahaya lainnya; (c) Melakukan akses tidak sah (unauthorized access) ke sistem, server, atau data pengguna lain; (d) Menyalahgunakan fitur forum untuk menyebarkan informasi palsu (hoax) atau menyesatkan; (e) Melakukan impersonasi terhadap pihak lain; (f) Melakukan tindakan yang dapat merusak, melumpuhkan, atau membebani infrastruktur platform secara berlebihan. Pelanggaran dapat mengakibatkan penghapusan akun dan/atau tuntutan pidana sesuai peraturan perundang-undangan.',
  },
  {
    icon: AlertCircle,
    title: '7. Batasan Tanggung Jawab',
    content: 'Platform Perintis disediakan "apa adanya" (as is) dan "tersedia sebagaimana adanya" (as available). Kami tidak memberikan jaminan (warranty) bahwa Layanan akan berjalan tanpa gangguan, bebas dari kesalahan teknis, atau aman dari serangan pihak ketiga. Dalam batas maksimal yang diizinkan oleh hukum Indonesia, Perintis tidak bertanggung jawab atas kerugian langsung, tidak langsung, insidental, konsekuensial, atau hukuman yang timbul dari penggunaan atau ketidakmampuan menggunakan Layanan. Hasil analisis AI bersifat prediktif dan tidak menjamin kesuksesan bisnis di dunia nyata.',
  },
  {
    icon: MessageSquare,
    title: '8. Konten Pengguna di Forum',
    content: 'Pengguna bertanggung jawab penuh atas konten yang diunggah, diposting, atau dibagikan di Forum Diskusi Terbuka. Dengan mengirimkan konten, Anda memberikan lisensi non-eksklusif, bebas royalti, dan berlaku di seluruh dunia kepada Perintis untuk menampilkan, mendistribusikan, dan mempromosikan konten tersebut di platform. Perintis berhak, tanpa kewajiban, untuk memoderasi, menyunting, atau menghapus konten yang melanggar ketentuan ini atau hukum yang berlaku. Konten yang melanggar UU ITE (termasuk ujaran kebencian, SARA, pornografi, dan penipuan) akan dilaporkan kepada pihak berwenang.',
  },
  {
    icon: Globe,
    title: '9. Hukum yang Berlaku dan Penyelesaian Sengketa',
    content: 'Ketentuan Layanan ini tunduk pada hukum Negara Kesatuan Republik Indonesia. Setiap sengketa yang timbul dari atau terkait dengan penggunaan Layanan akan diselesaikan terlebih dahulu melalui musyawarah untuk mencapai mufakat. Jika tidak tercapai kesepakatan dalam waktu 30 (tiga puluh) hari, sengketa akan diselesaikan melalui Pengadilan Negeri Jakarta Pusat, Indonesia. Pengguna setuju untuk tunduk pada yurisdiksi eksklusif pengadilan tersebut. Pengguna juga berhak menggunakan mekanisme penyelesaian sengketa alternatif (APS/ADR) sesuai peraturan perundang-undangan.',
  },
  {
    icon: Lock,
    title: '10. Perubahan Ketentuan',
    content: 'Kami berhak untuk mengubah, memodifikasi, atau memperbarui Ketentuan Layanan ini sewaktu-waktu. Perubahan akan diumumkan melalui platform dan/atau email kepada Pengguna terdaftar. Perubahan berlaku efektif 14 (empat belas) hari setelah pengumuman. Dengan terus menggunakan Layanan setelah perubahan berlaku efektif, Anda dianggap menyetujui ketentuan yang telah diperbarui. Jika Anda tidak menyetujui perubahan, Anda dapat berhenti menggunakan Layanan dan menghapus akun Anda.',
  },
  {
    icon: Mail,
    title: '11. Kontak',
    content: 'Untuk pertanyaan, saran, atau pengaduan terkait Ketentuan Layanan ini, silakan hubungi kami melalui: Email: support@perintis.id Alamat: Perintis, Jakarta, Indonesia. Kami akan merespons setiap pertanyaan atau keluhan dalam waktu 3x24 jam pada hari dan jam kerja.',
  },
];

export default function KetentuanLayanan() {
  return (
    <div className="space-y-8 animate-fade-in text-left max-w-4xl mx-auto pb-16 relative z-10">
      {/* Decorative */}
      <div className="absolute top-20 -left-20 w-80 h-80 bg-[#FF6B1A]/5 rounded-full blur-3xl -z-10 animate-float" />

      <header>
        <div className="flex items-center gap-3 mb-4">
          <Scale className="w-6 h-6 text-[#FF6B1A] drop-shadow-[0_0_8px_rgba(0,242,254,0.4)]" />
          <span className="text-[10px] font-bold text-[#FF6B1A] bg-[#FF6B1A]/10 px-3 py-1 rounded-full uppercase tracking-wider border border-[#FF6B1A]/20">Terakhir diperbarui: 11 Juli 2026</span>
        </div>
        <h2 className="text-2xl font-extrabold text-[#171C38] tracking-tight">Ketentuan Layanan</h2>
        <p className="text-sm text-[#6F7178] mt-2 leading-relaxed font-semibold">
          Ketentuan Layanan ini mengatur hubungan hukum antara Anda ("Pengguna") dan Perintis dalam penggunaan platform,{' '}
          sesuai dengan{' '}
          <strong>Undang-Undang Nomor 11 Tahun 2008 tentang Informasi dan Transaksi Elektronik (UU ITE)</strong>,{' '}
          <strong>Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP)</strong>,{' '}
          serta peraturan pelaksana lainnya di Indonesia.
        </p>
      </header>

      <div className="space-y-5">
        {sections.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="glass-card rounded-[20px] p-6 md:p-8 animate-slide-up" style={{ animationDelay: `${(i + 1) * 0.08}s` }}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-[#FF6B1A]/10 flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#FF6B1A]/10">
                  <Icon className="w-5 h-5 text-[#FF6B1A]" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-base text-[#171C38]">{s.title}</h3>
                  <p className="text-sm text-[#6F7178] leading-relaxed font-medium">{s.content}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
