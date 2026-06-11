export default function TermsPage({ onNav }) {
  return (
    <div style={{ paddingTop: 64, minHeight: "100vh", background: "#f8f8f6" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "64px 24px 96px" }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontFamily: "Space Mono, monospace", fontSize: 12, color: "#f05a28", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>
            Legal
          </div>
          <h1 style={{ fontFamily: "Bricolage Grotesque, sans-serif", fontSize: 40, fontWeight: 800, letterSpacing: -1.5, color: "#0f0f0e", marginBottom: 12, lineHeight: 1.1 }}>
            Terms & Conditions
          </h1>
          <p style={{ fontSize: 14, color: "#888884", lineHeight: 1.7 }}>
            Berlaku efektif: Juni 2025 &nbsp;·&nbsp; Versi 1.0 &nbsp;·&nbsp; Dioperasikan oleh Artra Group
          </p>
        </div>

        {/* Intro */}
        <div style={{ background: "#fff2ed", border: "1px solid rgba(240,90,40,0.2)", borderRadius: 12, padding: "16px 20px", marginBottom: 40 }}>
          <p style={{ fontSize: 14, color: "#0f0f0e", lineHeight: 1.7, margin: 0 }}>
            Harap baca syarat dan ketentuan ini dengan saksama. Dengan menggunakan layanan renviz.app, Anda dianggap telah membaca, memahami, dan menyetujui seluruh ketentuan yang tercantum di bawah ini.
          </p>
        </div>

        {/* Sections */}
        {[
          {
            num: "01",
            title: "Ketentuan Penggunaan",
            content: "Renviz.app ditawarkan kepada Anda dengan syarat Anda menyetujui seluruh syarat, ketentuan, dan pemberitahuan yang tercantum dalam dokumen ini. Jika Anda tidak menyetujui ketentuan ini, harap hentikan penggunaan layanan ini segera.",
          },
          {
            num: "02",
            title: "Gambaran Umum Layanan",
            content: "Renviz.app adalah platform berbasis kecerdasan buatan yang memungkinkan pengguna mengubah gambar denah atau sketsa bangunan menjadi visualisasi render arsitektur berkualitas tinggi. Layanan dioperasikan oleh Artra Group.",
          },
          {
            num: "03",
            title: "Perubahan Layanan dan Ketentuan",
            content: "Renviz.app berhak untuk mengubah, memperbarui, atau menghentikan layanan, harga, dan ketentuan ini sewaktu-waktu tanpa pemberitahuan sebelumnya. Penggunaan Anda yang berkelanjutan setelah perubahan berlaku dianggap sebagai penerimaan atas perubahan tersebut.",
          },
          {
            num: "04",
            title: "Hak Cipta",
            content: "Seluruh konten pada situs ini, termasuk merek dagang, logo, antarmuka, dan materi lainnya, adalah milik Renviz.app dan Renviz App, serta dilindungi oleh hukum hak cipta yang berlaku di Indonesia. Dilarang menyalin, mereproduksi, atau mendistribusikan konten tanpa izin tertulis sebelumnya.",
          },
          {
            num: "05",
            title: "Pendaftaran Akun",
            content: "Untuk menggunakan layanan berbayar, Anda diwajibkan mendaftar menggunakan akun Google. Anda bertanggung jawab penuh atas kerahasiaan akun dan semua aktivitas yang terjadi melalui akun Anda. Anda tidak diperkenankan memalsukan identitas, berbagi akun, atau menggunakan akun orang lain.",
          },
          {
            num: "06",
            title: "Sistem Kredit dan Pembayaran",
            content: "Layanan Renviz.app menggunakan sistem kredit. Setiap render membutuhkan sejumlah kredit sesuai paket yang dipilih. Kredit dapat dibeli melalui QRIS dan dompet digital melalui Midtrans. Harga dapat berubah sewaktu-waktu. Kredit tidak memiliki masa kedaluwarsa selama akun aktif dan tidak dapat dipindahkan ke akun lain.",
          },
          {
            num: "07",
            title: "Kebijakan Pengembalian Dana",
            content: null,
            isRefund: true,
          },
          {
            num: "08",
            title: "Hak atas Konten yang Diunggah",
            content: "Anda menyatakan memiliki hak atas gambar yang diunggah dan bertanggung jawab penuh atas kontennya. Renviz.app tidak mengklaim kepemilikan atas gambar Anda, namun Anda memberikan izin kepada kami untuk memprosesnya guna menghasilkan render. Anda dilarang mengunggah konten yang melanggar hukum, mengandung SARA, atau melanggar hak cipta pihak ketiga.",
          },
          {
            num: "09",
            title: "Komunikasi Elektronik",
            content: "Dengan mendaftar di Renviz.app, Anda menyetujui bahwa kami dapat mengirimkan komunikasi elektronik terkait pembaruan layanan, promosi, atau informasi akun. Anda dapat berhenti berlangganan kapan saja melalui pengaturan akun.",
          },
          {
            num: "10",
            title: "Privasi",
            content: "Renviz.app berkomitmen menjaga privasi pengguna. Informasi pribadi yang Anda berikan hanya digunakan untuk keperluan operasional layanan dan tidak akan dijual atau disalahgunakan kepada pihak ketiga mana pun.",
          },
          {
            num: "11",
            title: "Ganti Rugi",
            content: "Anda setuju untuk membebaskan Renviz.app dan Artra Group dari segala tuntutan, kerugian, kewajiban, dan biaya (termasuk biaya hukum) yang timbul dari penggunaan Anda atas layanan ini atau pelanggaran terhadap Syarat & Ketentuan ini.",
          },
          {
            num: "12",
            title: "Penafian Tanggung Jawab",
            content: "Renviz.app tidak menjamin bahwa hasil render akan selalu sempurna atau sesuai ekspektasi, mengingat hasil dipengaruhi oleh kualitas gambar yang diunggah. Renviz.app tidak bertanggung jawab atas kerugian langsung maupun tidak langsung akibat penggunaan layanan ini.",
          },
          {
            num: "13",
            title: "Penangguhan Layanan",
            content: "Renviz.app berhak menangguhkan atau menghentikan akses pengguna apabila ditemukan pelanggaran terhadap Syarat & Ketentuan ini, termasuk penyalahgunaan sistem, upaya manipulasi kredit, atau aktivitas yang merugikan pengguna lain.",
          },
          {
            num: "14",
            title: "Hukum yang Berlaku",
            content: "Syarat & Ketentuan ini tunduk pada dan diatur oleh hukum yang berlaku di Republik Indonesia.",
          },
          {
            num: "15",
            title: "Pertanyaan dan Kontak",
            content: null,
            isContact: true,
          },
        ].map((s) => (
          <div key={s.num} style={{ marginBottom: 36, paddingBottom: 36, borderBottom: "1px solid #e8e8e4" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 10 }}>
              <span style={{ fontFamily: "Space Mono, monospace", fontSize: 10, color: "#888884", background: "#e8e8e4", padding: "2px 6px", borderRadius: 3 }}>
                {s.num}
              </span>
              <h2 style={{ fontFamily: "Bricolage Grotesque, sans-serif", fontSize: 17, fontWeight: 700, color: "#0f0f0e", letterSpacing: -0.3 }}>
                {s.title}
              </h2>
            </div>

            {s.content && (
              <p style={{ fontSize: 15, color: "#555552", lineHeight: 1.8, margin: 0 }}>{s.content}</p>
            )}

            {s.isRefund && (
              <>
                <div style={{ background: "#0f0f0e", borderRadius: 10, padding: "16px 20px", margin: "12px 0" }}>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", lineHeight: 1.8, margin: 0 }}>
                    Kredit yang telah dibeli bersifat <strong style={{ color: "#ff7a4d" }}>non-refundable</strong> (tidak dapat dikembalikan). Namun, apabila terjadi kegagalan render yang disebabkan oleh kesalahan sistem Renviz.app, kredit yang terpakai akan dikembalikan secara otomatis ke akun pengguna.
                  </p>
                </div>
                <p style={{ fontSize: 14, color: "#888884", lineHeight: 1.7, margin: 0 }}>
                  Kegagalan render akibat kualitas gambar unggahan yang tidak memenuhi persyaratan sistem tidak termasuk dalam kebijakan pengembalian kredit.
                </p>
              </>
            )}

            {s.isContact && (
              <div style={{ fontSize: 15, color: "#555552", lineHeight: 2 }}>
                <p style={{ margin: 0 }}>Apabila Anda memiliki pertanyaan, masukan, atau keluhan terkait layanan atau Syarat & Ketentuan ini, silakan hubungi kami:</p>
                <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 4 }}>
                  <span>📧 <a href="mailto:support@renviz.app" style={{ color: "#f05a28", textDecoration: "none", fontWeight: 500 }}>support@renviz.app</a></span>
                  <span>💬 <a href="https://wa.me/6281807710181" target="_blank" rel="noreferrer" style={{ color: "#f05a28", textDecoration: "none", fontWeight: 500 }}>+62 818-0771-0181</a></span>
                  <span>🌐 <a href="https://renviz.app" style={{ color: "#f05a28", textDecoration: "none", fontWeight: 500 }}>renviz.app</a></span>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Footer */}
        <div style={{ paddingTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
          <p style={{ fontSize: 13, color: "#aaa", margin: 0 }}>Legal Notice — Renviz.app dioperasikan oleh Artra Group.</p>
          <p style={{ fontSize: 13, color: "#aaa", margin: 0 }}>© 2025 Artra Group. Hak cipta dilindungi undang-undang.</p>
        </div>

        {/* Back button */}
        <button
          onClick={() => onNav("home")}
          style={{ marginTop: 40, display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", background: "transparent", border: "1.5px solid #e8e8e4", borderRadius: 10, fontFamily: "DM Sans, sans-serif", fontSize: 14, fontWeight: 500, color: "#888884", cursor: "pointer" }}
        >
          ← Kembali ke Home
        </button>

      </div>
    </div>
  );
}
