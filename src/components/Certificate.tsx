import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Image from "next/image";

interface CertificateProps {
  userName: string;
  topic: string;
  score: number;
  date: string;
}

export default function Certificate({
  userName,
  topic,
  score,
  date,
}: CertificateProps) {
  const certificateRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!certificateRef.current) return;

    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF("l", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const x = (pdfWidth - imgWidth) / 2;
      const y = (pdfHeight - imgHeight) / 2;

      const imgData = canvas.toDataURL("image/png");

      pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
      pdf.save(`${userName}-${topic}-Certificate.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const styles = {
    container: {
      backgroundColor: "#ffffff",
      borderRadius: "0.5rem",
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      padding: "2rem",
      border: "8px double rgb(199, 210, 254)",
      minHeight: "600px",
    },
    heading: {
      color: "#111827",
      fontSize: "1.875rem",
      fontWeight: "700",
    },
    subtext: {
      color: "#4B5563",
      fontSize: "1.125rem",
    },
    userName: {
      color: "#4F46E5",
      fontSize: "2.25rem",
      fontWeight: "700",
    },
    topic: {
      color: "#111827",
      fontSize: "1.5rem",
      fontWeight: "700",
    },
    score: {
      color: "#4F46E5",
      fontSize: "1.875rem",
      fontWeight: "700",
    },
    date: {
      color: "#4B5563",
    },
    certId: {
      color: "#6B7280",
      fontSize: "0.875rem",
    },
    button: {
      backgroundColor: "#4F46E5",
      color: "#ffffff",
      padding: "0.75rem 1.5rem",
      borderRadius: "0.375rem",
      fontWeight: "500",
      display: "inline-flex",
      alignItems: "center",
      cursor: "pointer",
      border: "none",
      outline: "none",
    },
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div ref={certificateRef} style={styles.container}>
        {/* Certificate Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "1.5rem",
            }}
          >
            <Image
              src="/certificate-logo.svg"
              alt="Certificate Logo"
              width={32}
              height={32}
              style={{ height: "2rem" }}
            />
          </div>
          <h1 style={styles.heading}>Certificate of Completion</h1>
          <p style={styles.subtext}>This certifies that</p>
        </div>

        {/* Certificate Body */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={styles.userName}>{userName}</h2>
          <p style={{ ...styles.subtext, marginBottom: "1.5rem" }}>
            has successfully completed the assessment on
          </p>
          <h3 style={styles.topic}>{topic}</h3>
          <p style={{ ...styles.subtext, marginBottom: "0.5rem" }}>
            with a score of
          </p>
          <p style={styles.score}>{score}%</p>
          <p style={styles.date}>Completed on {date}</p>
        </div>

        {/* Certificate Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginTop: "3rem",
          }}
        >
          <div style={{ textAlign: "left" }}>
            <p style={styles.certId}>Certificate ID:</p>
            <p style={{ ...styles.certId, fontFamily: "monospace" }}>
              {`${Date.now()}-${userName.replace(/\s+/g, "-").toLowerCase()}`}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ marginBottom: "0.5rem" }}>
              <Image
                src="/signature.svg"
                alt="Digital Signature"
                width={48}
                height={48}
                style={{ height: "3rem", display: "inline-block" }}
              />
            </div>
            <p style={styles.certId}>Authorized Signature</p>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
        <button onClick={handleDownload} style={styles.button}>
          <svg
            style={{
              width: "1.25rem",
              height: "1.25rem",
              marginRight: "0.5rem",
            }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Download Certificate
        </button>
      </div>
    </div>
  );
}
