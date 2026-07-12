import React from 'react';
import { Shield, Mail, Database, Lock, Eye, FileText, Cookie, AlertTriangle, CheckCircle } from 'lucide-react';

const sections = [
  {
    icon: Shield,
    title: '1. Pendahuluan',
    content: 'Kebijakan Privasi ini menjelaskan bagaimana Perintis ("kami", "kita", "platform") mengumpulkan, menggunakan, menyimpan, melindungi, dan mengungkapkan data pribadi Anda sebagai Pengguna platform Perintis. Kebijakan ini disusun sesuai dengan Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi ("UU PDP"), Undang-Undang Nomor 11 Tahun 2008 tentang Informasi dan Transaksi Elektronik ("UU ITE") beserta perubahannya, serta Peraturan Pemerintah dan ketentuan turunan lainnya yang berlaku di Negara Kesatuan Republik Indonesia.',
  },
  {
    icon: Database,
    title: '2. Data Pribadi yang Dikumpulkan',
    content: 'Kami dapat mengumpulkan data pribadi berikut: (a) Data Identitas: nama lengkap, alamat email, nomor telepon; (b) Data Demografis: usia, jenis kelamin, lokasi geografis, pekerjaan; (c) Data Aktivitas: riwayat validasi ide bisnis, simulasi kalkulator, proyeksi ROI, diskusi forum, pencarian harga komoditas; (d) Data Teknis: alamat IP, jenis perangkat, browser, sistem operasi, cookie, dan data analitik penggunaan platform.',
  },
  {
    icon: FileText,
    title: '3. Dasar Hukum Pemrosesan Data',
    content: 'Kami memproses data pribadi Anda berdasarkan dasar hukum sebagai berikut: (a) Persetujuan eksplisit (consent) yang Anda berikan saat mendaftar dan menggunakan fitur platform; (b) Kebutuhan untuk melaksanakan perjanjian (contractual necessity) yaitu ketentuan layanan yang Anda setujui; (c) Kewajiban hukum (legal obligation) untuk mematuhi peraturan perundang-undangan yang berlaku di Indonesia; (d) Kepentingan sah (legitimate interest) untuk meningkatkan kualitas layanan, keamanan platform, dan pengembangan fitur baru.',
  },
  {
    icon: Eye,
    title: '4. Tujuan Penggunaan Data',
    content: 'Data pribadi Anda digunakan untuk: (a) Menyediakan, mengoperasikan, dan memelihara layanan platform Perintis; (b) Memproses analisis AI untuk validasi ide bisnis dan simulasi keuangan; (c) Meningkatkan personalisasi rekomendasi dan pengalaman pengguna; (d) Mengirimkan notifikasi transaksional, pembaruan fitur, dan informasi layanan; (e) Menganalisis tren penggunaan untuk pengembangan produk; (f) Mendeteksi, mencegah, dan menangani aktivitas penipuan, penyalahgunaan, atau pelanggaran ketentuan layanan.',
  },
  {
    icon: Database,
    title: '5. Penyimpanan dan Retensi Data',
    content: 'Data pribadi Anda disimpan di server yang berlokasi di wilayah Republik Indonesia dan/atau di pusat data mitra kami yang memenuhi standar keamanan setara. Jangka waktu penyimpanan data adalah selama akun Anda aktif dan maksimal 5 (lima) tahun setelah akun tidak aktif atau dihapus, kecuali diwajibkan lain oleh ketentuan perundang-undangan. Setelah jangka waktu tersebut, data akan dihapus atau dianonimkan secara permanen.',
  },
  {
    icon: Lock,
    title: '6. Keamanan Data',
    content: 'Kami menerapkan langkah-langkah keamanan teknis dan organisasional yang sesuai dengan standar industri untuk melindungi data pribadi Anda, termasuk: enkripsi SSL/TLS untuk transmisi data, enkripsi pada data sensitif yang disimpan, firewall dan sistem deteksi intrusi, akses terbatas berbasis peran (role-based access control), audit keamanan berkala, dan pelatihan kesadaran keamanan data bagi seluruh staf. Meskipun demikian, tidak ada metode transmisi atau penyimpanan data yang sepenuhnya aman, dan kami tidak dapat menjamin keamanan absolut.',
  },
  {
    icon: CheckCircle,
    title: '7. Hak-Hak Anda sebagai Pemilik Data',
    content: 'Berdasarkan UU PDP, Anda memiliki hak-hak berikut: (a) Hak untuk mengetahui tujuan pemrosesan data pribadi; (b) Hak untuk mengakses dan meminta salinan data pribadi Anda; (c) Hak untuk melengkapi, memperbarui, dan/atau memperbaiki data yang tidak akurat; (d) Hak untuk mengakhiri pemrosesan, menghapus, atau memusnahkan data pribadi; (e) Hak untuk menarik persetujuan pemrosesan data; (f) Hak untuk mengajukan keberatan atas tindakan pengambilan keputusan berbasis profil; (g) Hak untuk menunda atau membatasi pemrosesan data; (h) Hak untuk memindahkan data pribadi (portabilitas data). Untuk melaksanakan hak-hak tersebut, silakan hubungi kami melalui kontak yang tercantum di bawah.',
  },
  {
    icon: Cookie,
    title: '8. Penggunaan Cookie dan Pelacakan',
    content: 'Platform Perintis menggunakan cookie dan teknologi pelacakan sejenis untuk meningkatkan pengalaman pengguna, menganalisis pola penggunaan, dan menyimpan preferensi Anda. Jenis cookie yang digunakan meliputi: cookie sesi (session cookies), cookie fungsional (functional cookies), dan cookie analitik (analytics cookies). Anda dapat mengatur preferensi cookie melalui pengaturan browser Anda. Dengan terus menggunakan platform, Anda menyetujui penggunaan cookie sesuai kebijakan ini. Penonaktifan cookie tertentu dapat mempengaruhi fungsionalitas platform.',
  },
  {
    icon: AlertTriangle,
    title: '9. Pengungkapan Data kepada Pihak Ketiga',
    content: 'Kami tidak menjual data pribadi Anda kepada pihak ketiga. Data dapat dibagikan kepada: (a) Penyedia layanan mitra (cloud hosting, analitik, AI API) yang terikat kewajiban kerahasiaan; (b) Penegak hukum atau regulator jika diwajibkan oleh peraturan perundang-undangan yang berlaku; (c) Pihak lain dengan persetujuan eksplisit Anda. Seluruh pihak ketiga yang menerima data wajib mematuhi standar perlindungan data yang setara dengan kebijakan ini dan peraturan perundang-undangan Indonesia.',
  },
  {
    icon: Mail,
    title: '10. Kontak dan Pengaduan',
    content: 'Jika Anda memiliki pertanyaan, keberatan, atau ingin mengajukan pengaduan terkait pemrosesan data pribadi Anda, silakan hubungi kami melalui: Email: privacy@perintis.id Alamat: Perintis, Jakarta, Indonesia. Kami akan merespons permintaan Anda dalam waktu paling lambat 3x24 jam. Jika pengaduan tidak terselesaikan, Anda berhak mengajukan pengaduan kepada Lembaga Penyelenggara Pelindungan Data Pribadi sesuai UU PDP.',
  },
];

export default function KebijakanPrivasi() {
  return (
    <div className="space-y-8 animate-fade-in text-left max-w-4xl mx-auto pb-16 relative z-10">
      {/* Decorative */}
      <div className="absolute top-20 -left-20 w-80 h-80 bg-[#FF6B1A]/5 rounded-full blur-3xl -z-10 animate-float" />

      <header>
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-[#FF6B1A] drop-shadow-[0_0_8px_rgba(0,242,254,0.4)]" />
          <span className="text-[10px] font-bold text-[#FF6B1A] bg-[#FF6B1A]/10 px-3 py-1 rounded-full uppercase tracking-wider border border-[#FF6B1A]/20">Terakhir diperbarui: 11 Juli 2026</span>
        </div>
        <h2 className="text-2xl font-extrabold text-[#171C38] tracking-tight">Kebijakan Privasi</h2>
        <p className="text-sm text-[#6F7178] mt-2 leading-relaxed font-semibold">
          Kebijakan Privasi ini mengatur bagaimana Perintis melindungi dan menggunakan data pribadi Anda sesuai dengan{' '}
          <strong>Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP)</strong> dan{' '}
          <strong>Undang-Undang Nomor 11 Tahun 2008 tentang Informasi dan Transaksi Elektronik (UU ITE)</strong>.
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
