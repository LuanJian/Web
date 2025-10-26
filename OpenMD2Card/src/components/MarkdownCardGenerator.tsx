"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { marked } from "marked";
import { toPng, toSvg } from "html-to-image";

interface CardStyle {
  name: string;
  styles: React.CSSProperties;
}

interface UploadedFont {
  name: string;
  dataUrl: string;
  format: string;
}

const initialAvailableFonts: string[] = [
  "Arial, sans-serif",
  "\"Times New Roman\", Times, serif",
  "\"Courier New\", Courier, monospace",
  "Georgia, serif",
  "\"Palatino Linotype\", \"Book Antiqua\", Palatino, serif",
  "Tahoma, Geneva, sans-serif",
  "\"Trebuchet MS\", Helvetica, sans-serif",
  "Verdana, Geneva, sans-serif",
  "\"Comic Sans MS\", cursive, sans-serif",
  "\"Lucida Console\", Monaco, monospace",
  "\"Dancing Script\", cursive",
  "\"Kalam\", cursive",
  "\"Roboto Mono\", monospace",
];

const cardStyles: CardStyle[] = [
  {
    name: "Default Light",
    styles: {
      border: "1px solid #e0e0e0",
      padding: "25px",
      borderRadius: "12px",
      backgroundColor: "#ffffff",
      color: "#212121",
      boxShadow: "0 6px 12px rgba(0,0,0,0.08)",
      fontFamily: "Arial, sans-serif",
      lineHeight: "1.6",
      fontSize: "16px",
    },
  },
  {
    name: "Default Dark",
    styles: {
      border: "1px solid #424242",
      padding: "25px",
      borderRadius: "12px",
      backgroundColor: "#212121",
      color: "#eeeeee",
      boxShadow: "0 6px 12px rgba(0,0,0,0.25)",
      fontFamily: "Arial, sans-serif",
      lineHeight: "1.6",
      fontSize: "16px",
    },
  },
  {
    name: "Clean White",
    styles: {
      padding: "20px",
      borderRadius: "8px",
      backgroundColor: "#FFFFFF",
      color: "#333333",
      fontFamily: "Arial, sans-serif",
      fontSize: "16px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
  },
  {
    name: "Notebook Paper",
    styles: {
      padding: "25px",
      paddingLeft: "40px",
      borderRadius: "3px",
      backgroundColor: "#FEFDFB",
      color: "#2c3e50",
      fontFamily: "\"Kalam\", cursive",
      fontSize: "16px",
      lineHeight: "2.2em",
      border: "1px solid #E0E0E0",
      boxShadow: "2px 2px 5px rgba(0,0,0,0.05)",
      position: "relative",
    },
  },
  {
    name: "Sunset Gradient",
    styles: {
      padding: "30px",
      borderRadius: "15px",
      background: "linear-gradient(45deg, #FFC371, #FF5F6D)",
      color: "#ffffff",
      fontFamily: "Verdana, Geneva, sans-serif",
      fontSize: "16px",
      boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
      textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
    },
  },
  {
    name: "Oceanic Blue",
    styles: {
      padding: "25px",
      borderRadius: "8px",
      background: "#0077B6",
      color: "#E0F7FA",
      fontFamily: "Tahoma, Geneva, sans-serif",
      fontSize: "15px",
      borderLeft: "5px solid #00B4D8",
      boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
    },
  },
  {
    name: "Vintage Paper",
    styles: {
      padding: "30px",
      borderRadius: "5px",
      backgroundColor: "#F5E8C7",
      color: "#5D4037",
      fontFamily: "Georgia, serif",
      fontSize: "17px",
      border: "1px solid #D2B48C",
      boxShadow: "inset 0 0 10px rgba(0,0,0,0.05)",
      lineHeight: "1.7",
    },
  },
  {
    name: "Monochrome Contrast",
    styles: {
        padding: "35px",
        borderRadius: "0px",
        backgroundColor: "#FFFFFF",
        color: "#000000",
        fontFamily: "\"Helvetica Neue\", Helvetica, Arial, sans-serif",
        fontSize: "16px",
        border: "2px solid #000000",
        letterSpacing: "0.5px",
    },
  },
  {
    name: "Forest Whisper",
    styles: {
        padding: "28px",
        borderRadius: "10px",
        backgroundColor: "#2F4F4F", 
        color: "#AAFFAA", 
        fontFamily: "\"Palatino Linotype\", \"Book Antiqua\", Palatino, serif",
        fontSize: "16px",
        boxShadow: "0 5px 10px rgba(0,0,0,0.3)",
        borderTop: "3px solid #556B2F", 
    },
  },
  {
    name: "Pastel Dream",
    styles: {
      padding: "30px",
      borderRadius: "15px",
      background: "linear-gradient(135deg, #FFD1DC, #BDE0FE)", 
      color: "#4A4A6A", 
      fontFamily: "Arial, sans-serif",
      fontSize: "16px",
      boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
    },
  },
  {
    name: "Tech Noir",
    styles: {
      padding: "25px",
      borderRadius: "6px",
      backgroundColor: "#1A1A1A", 
      color: "#00FFAA", 
      fontFamily: "Consolas, Monaco, monospace",
      fontSize: "15px",
      border: "1px solid #333333",
      boxShadow: "0 0 15px rgba(0, 255, 170, 0.2)",
      lineHeight: "1.6",
    },
  },
  {
    name: "Zen Minimalist",
    styles: {
      padding: "35px",
      borderRadius: "0px",
      backgroundColor: "#F9F9F9",
      color: "#333333",
      fontFamily: "\"Helvetica Neue\", Helvetica, Arial, sans-serif",
      fontSize: "16px",
      border: "none",
      borderLeft: "3px solid #CCCCCC",
      lineHeight: "1.8",
      letterSpacing: "0.5px",
    },
  },
  {
    name: "Autumn Leaves",
    styles: {
      padding: "30px",
      borderRadius: "12px",
      backgroundColor: "#FFF8E1",
      color: "#5D4037",
      fontFamily: "Georgia, serif",
      fontSize: "16px",
      border: "1px solid #FFCC80",
      boxShadow: "0 4px 8px rgba(255, 111, 0, 0.1)",
      backgroundImage: "radial-gradient(circle at top right, rgba(255, 111, 0, 0.05), transparent 70%)",
    },
  },
  {
    name: "Watercolor Wash",
    styles: {
      padding: "30px",
      borderRadius: "15px",
      background: "linear-gradient(120deg, #E0F7FA, #B2EBF2, #E0F7FA)",
      color: "#006064",
      fontFamily: "\"Palatino Linotype\", \"Book Antiqua\", Palatino, serif",
      fontSize: "17px",
      boxShadow: "0 6px 12px rgba(0, 188, 212, 0.1)",
      border: "1px solid rgba(0, 188, 212, 0.2)",
    },
  },
  {
    name: "Candy Bubble",
    styles: {
      padding: "25px",
      borderRadius: "20px",
      backgroundColor: "#FFDEF0",
      color: "#D81B60",
      fontFamily: "Arial, sans-serif",
      fontSize: "16px",
      border: "3px dashed #E91E63",
      boxShadow: "0 8px 16px rgba(233, 30, 99, 0.2)",
    },
  },
];

type Theme = "light" | "dark";
type Language = "en" | "zh";
type SplitMode = "long" | "auto" | "hr";

const translations = {
  en: {
    title: "Markdown to Card Generator",
    switchToDarkMode: "Switch to Dark Mode",
    switchToLightMode: "Switch to Light Mode",
    switchToChinese: "切换到中文",
    cardStyle: "Card Style:",
    createNewStyle: "Create New Style",
    customStyleName: "Style Name:",
    customStyleCSS: "Custom CSS:",
    saveStyle: "Save Style",
    cancelStyle: "Cancel",
    fontFamily: "Font Family:",
    uploadFont: "Upload Font:",
    fontSize: "Font Size (px):",
    textColor: "Text Color:",
    backgroundColor: "Background Color:",
    backgroundImage: "Background Image:",
    clearImage: "Clear",
    preview: "Preview",
    exportPNG: "Export as PNG",
    exportSVG: "Export as SVG",
     copyToClipboard: "Copy to Clipboard",
    copyForWeChat: "Copy to WeChat Official Account",
    footerText: "OpenMD2Card - Markdown to Card Generator",
    markdownPlaceholder: "Enter Markdown here...\nTip: You can also paste image URLs directly into the markdown.\nUse --- for horizontal rule splits.",
    alertFontUploaded: (fontName: string) => `Font \"${fontName}\" uploaded and applied! `,
    alertFontExists: (fontName: string) => `Font \"${fontName}\" is already uploaded. Please choose a different file or rename it.`,
    alertUnsupportedFormat: "Unsupported font format. Please use TTF, OTF, WOFF, or WOFF2.",
    alertExportPNGFailed: "Failed to export PNG. See console for details.",
    alertExportSVGFailed: "Failed to export SVG. See console for details.",
    alertCopyToClipboardFailed: "Failed to copy to clipboard. This feature may not be supported in your browser or the HTTPS context is missing. See console for details.",
    alertCopiedToClipboard: "Card copied to clipboard as image!",
    alertCopyWeChatFailed: "Failed to copy for WeChat. See console for details.",
    alertCopiedToWeChat: "Card content (HTML) copied for WeChat! Paste into WeChat editor.",
    cardWidth: "Width (px or auto):",
    cardHeight: "Height (px or auto):",
    autoHideOverflow: "Auto Hide Overflow",
    splitModeLabel: "Split Mode:",
    splitModeLong: "Long Text (Single Card)",
    splitModeAuto: "Auto Split (Experimental - behaves as Long Text for now)",
    splitModeHR: "Split by Horizontal Rule (---)",
    linkAbout: "About",
    linkFAQ: "FAQ",
    linkFeatures: "Features",
    linkUsageGuide: "Usage Guide",
  },
  zh: {
    title: "Markdown 转卡片生成器",
    switchToDarkMode: "切换到深色模式",
    switchToLightMode: "切换到浅色模式",
    switchToEnglish: "Switch to English",
    cardStyle: "卡片样式：",
    createNewStyle: "新建样式",
    customStyleName: "样式名称：",
    customStyleCSS: "自定义CSS：",
    saveStyle: "保存样式",
    cancelStyle: "取消",
    fontFamily: "字体：",
    uploadFont: "上传字体：",
    fontSize: "字号 (px)：",
    textColor: "文字颜色：",
    backgroundColor: "背景颜色：",
    backgroundImage: "背景图片：",
    clearImage: "清除",
    preview: "预览",
    exportPNG: "导出为 PNG",
    exportSVG: "导出为 SVG",
    copyToClipboard: "复制到剪贴板",
    copyForWeChat: "复制到微信公众号",
    footerText: "OpenMD2Card - Markdown 转卡片生成器",
    markdownPlaceholder: "在此输入 Markdown...\n提示：您可以直接粘贴图片网址到 Markdown 中。\n使用 --- 进行横向分割线拆分。",
    alertFontUploaded: (fontName: string) => `字体 \"${fontName}\" 已上传并应用！`,
    alertFontExists: (fontName: string) => `字体 \"${fontName}\" 已存在。请选择其他文件或重命名。`,
    alertUnsupportedFormat: "不支持的字体格式。请使用 TTF, OTF, WOFF, 或 WOFF2。",
    alertExportPNGFailed: "导出 PNG 失败。详情请查看控制台。",
    alertExportSVGFailed: "导出 SVG 失败。详情请查看控制台。",
    alertCopyToClipboardFailed: "复制到剪贴板失败。您的浏览器可能不支持此功能或缺少 HTTPS 上下文。详情请查看控制台。",
    alertCopiedToClipboard: "卡片已作为图片复制到剪贴板！",
    alertCopyWeChatFailed: "复制到微信失败。详情请查看控制台。",
    alertCopiedToWeChat: "卡片内容 (HTML) 已复制，可粘贴至微信编辑器！",
    cardWidth: "宽度 (px 或 auto)：",
    cardHeight: "高度 (px 或 auto)：",
    autoHideOverflow: "自动隐藏溢出内容",
    splitModeLabel: "拆分模式：",
    splitModeLong: "长图文（单卡片）",
    splitModeAuto: "自动拆分（实验性 - 当前同长图文模式）",
    splitModeHR: "按分割线 (---) 拆分",
    linkAbout: "关于",
    linkFAQ: "常见问题",
    linkFeatures: "功能介绍",
    linkUsageGuide: "使用指南",
  },
};

export default function MarkdownCardGenerator() {
  const [markdownInput, setMarkdownInput] = useState(
    `# Welcome to MD2Card!\n\nThis is a **live demo** of the Markdown to Card generator.\n\n## Features\n- Real-time Markdown preview\n- Multiple card styles\n- Font and Color Customization\n- Upload custom fonts!\n- Image upload (as background)\n- Export to PNG & SVG\n- Copy to clipboard\n- WeChat Typography Optimization`
  );
  const [selectedStyle, setSelectedStyle] = useState<CardStyle>(cardStyles[0]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [customFontFamily, setCustomFontFamily] = useState<string>(
    cardStyles[0].styles.fontFamily?.toString() || "Arial, sans-serif"
  );
  const [customFontSize, setCustomFontSize] = useState<string>(
    cardStyles[0].styles.fontSize?.toString() || "16px"
  );
  const [customTextColor, setCustomTextColor] = useState<string>(
    cardStyles[0].styles.color?.toString() || "#212121"
  );
  const [customBackgroundColor, setCustomBackgroundColor] = useState<string>(
    cardStyles[0].styles.backgroundColor?.toString() || "#ffffff"
  );
  const [globalTheme, setGlobalTheme] = useState<Theme>("light");
  const [uploadedFonts, setUploadedFonts] = useState<UploadedFont[]>([]);
  const [availableFonts, setAvailableFonts] = useState<string[]>(
    initialAvailableFonts
  );
  const [language, setLanguage] = useState<Language>("zh");
  const [cardWidth, setCardWidth] = useState<string>("600px");
  const [cardHeight, setCardHeight] = useState<string>("auto");
  const [autoHideOverflow, setAutoHideOverflow] = useState<boolean>(true);
  const [splitMode, setSplitMode] = useState<SplitMode>("long");
  const [markdownSegments, setMarkdownSegments] = useState<string[]>([]);
  const [showCustomStyleModal, setShowCustomStyleModal] = useState<boolean>(false);
  const [customStyleName, setCustomStyleName] = useState<string>("");
  const [customStyleCSS, setCustomStyleCSS] = useState<string>("");
  const [customStyles, setCustomStyles] = useState<CardStyle[]>([]);

  const cardPreviewContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fontInputRef = useRef<HTMLInputElement>(null);

  const t = translations[language];

  useEffect(() => {
    let segments: string[];
    if (splitMode === "hr") {
      segments = markdownInput.split(/\n(?:---|\*\*\*|___)\n/).map(s => s.trim()).filter(s => s.length > 0);
    } else if (splitMode === "auto") {
      segments = [markdownInput]; 
    } else { // long
      segments = [markdownInput];
    }
    setMarkdownSegments(segments);
  }, [markdownInput, splitMode]);

  // 配置marked
  useEffect(() => {
    marked.setOptions({
      breaks: true,
      gfm: true
    });
  }, []);

  useEffect(() => {
    // Update custom controls when selectedStyle changes
    setCustomFontFamily(
      selectedStyle.styles.fontFamily?.toString() || customFontFamily || "Arial, sans-serif"
    );
    setCustomFontSize(selectedStyle.styles.fontSize?.toString() || customFontSize || "16px");
    setCustomTextColor(selectedStyle.styles.color?.toString() || customTextColor || "#212121");
    setCustomBackgroundColor(
      selectedStyle.styles.backgroundColor?.toString() || customBackgroundColor || "#ffffff"
    );
  }, [selectedStyle]);

  const toggleTheme = () => {
    setGlobalTheme(globalTheme === "light" ? "dark" : "light");
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "zh" : "en");
  };

  const exportAsPNG = async (index: number) => {
    try {
      const cardElement = document.getElementById(`card-preview-${index}`);
      if (!cardElement) return;
      
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '-9999px';
      document.body.appendChild(tempContainer);
      
      const clonedCard = cardElement.cloneNode(true) as HTMLElement;
      tempContainer.appendChild(clonedCard);
      
      Object.assign(clonedCard.style, currentCardBaseStyle);
      
      if (uploadedImage) {
        const wrapperDiv = document.createElement('div');
        Object.assign(wrapperDiv.style, cardWrapperStyle);
        tempContainer.removeChild(clonedCard);
        wrapperDiv.appendChild(clonedCard);
        tempContainer.appendChild(wrapperDiv);
      }
      
      const fontStyles = document.createElement('style');
      fontStyles.textContent = uploadedFonts.map(font => (
        `@font-face {
          font-family: "${font.name}";
          src: url(${font.dataUrl}) format("${font.format}");
          font-weight: normal;
          font-style: normal;
        }`
      )).join('\n');
      tempContainer.appendChild(fontStyles);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const dataUrl = await toPng(uploadedImage ? tempContainer.firstChild as HTMLElement : clonedCard, {
        quality: 0.95,
        backgroundColor: customBackgroundColor || selectedStyle.styles.backgroundColor?.toString() || '#ffffff',
      });
      
      document.body.removeChild(tempContainer);
      
      const link = document.createElement('a');
      link.download = `md2card-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Export PNG failed:', error);
      alert(t.alertExportPNGFailed);
    }
  };

  const exportAsSVG = async (index: number) => {
    try {
      const cardElement = document.getElementById(`card-preview-${index}`);
      if (!cardElement) return;
      
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '-9999px';
      document.body.appendChild(tempContainer);
      
      const clonedCard = cardElement.cloneNode(true) as HTMLElement;
      tempContainer.appendChild(clonedCard);
      
      Object.assign(clonedCard.style, currentCardBaseStyle);
      
      if (uploadedImage) {
        const wrapperDiv = document.createElement('div');
        Object.assign(wrapperDiv.style, cardWrapperStyle);
        tempContainer.removeChild(clonedCard);
        wrapperDiv.appendChild(clonedCard);
        tempContainer.appendChild(wrapperDiv);
      }
      
      const fontStyles = document.createElement('style');
      fontStyles.textContent = uploadedFonts.map(font => (
        `@font-face {
          font-family: "${font.name}";
          src: url(${font.dataUrl}) format("${font.format}");
          font-weight: normal;
          font-style: normal;
        }`
      )).join('\n');
      tempContainer.appendChild(fontStyles);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const dataUrl = await toSvg(uploadedImage ? tempContainer.firstChild as HTMLElement : clonedCard, {
        backgroundColor: customBackgroundColor || selectedStyle.styles.backgroundColor?.toString() || '#ffffff',
      });
      
      document.body.removeChild(tempContainer);
      
      const link = document.createElement('a');
      link.download = `md2card-${Date.now()}.svg`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Export SVG failed:', error);
      alert(t.alertExportSVGFailed);
    }
  };

  const copyToClipboard = async (index: number) => {
    try {
      const cardElement = document.getElementById(`card-preview-${index}`);
      if (!cardElement) return;
      
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '-9999px';
      document.body.appendChild(tempContainer);
      
      const clonedCard = cardElement.cloneNode(true) as HTMLElement;
      tempContainer.appendChild(clonedCard);
      
      Object.assign(clonedCard.style, currentCardBaseStyle);
      
      if (uploadedImage) {
        const wrapperDiv = document.createElement('div');
        Object.assign(wrapperDiv.style, cardWrapperStyle);
        tempContainer.removeChild(clonedCard);
        wrapperDiv.appendChild(clonedCard);
        tempContainer.appendChild(wrapperDiv);
      }
      
      const fontStyles = document.createElement('style');
      fontStyles.textContent = uploadedFonts.map(font => (
        `@font-face {
          font-family: "${font.name}";
          src: url(${font.dataUrl}) format("${font.format}");
          font-weight: normal;
          font-style: normal;
        }`
      )).join('\n');
      tempContainer.appendChild(fontStyles);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const dataUrl = await toPng(uploadedImage ? tempContainer.firstChild as HTMLElement : clonedCard, {
        quality: 0.95,
        backgroundColor: customBackgroundColor || selectedStyle.styles.backgroundColor?.toString() || '#ffffff',
      });
      
      document.body.removeChild(tempContainer);
      
      const img = document.createElement('img');
      img.src = dataUrl;
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      await new Promise<void>(resolve => {
        img.onload = () => resolve();
      });
      
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      const blob = await new Promise<Blob | null>(resolve => {
        canvas.toBlob(resolve, 'image/png', 0.95);
      });
      
      if (!blob) {
        throw new Error('Failed to create blob from canvas');
      }
      
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      
      alert(t.alertCopiedToClipboard);
    } catch (error) {
      console.error('Copy to clipboard failed:', error);
      alert(t.alertCopyToClipboardFailed);
    }
  };

  const copyForWeChat = (index: number) => {
    try {
      const cardElement = document.getElementById(`card-preview-${index}`);
      if (!cardElement) return;
      
      // Clone the element to modify styles without affecting the preview
      const clonedCard = cardElement.cloneNode(true) as HTMLElement;
      
      // Apply inline styles for better compatibility
      Object.assign(clonedCard.style, currentCardBaseStyle);
      
      // Apply basic code block styles
      const codeBlocks = clonedCard.querySelectorAll('pre code');
      codeBlocks.forEach(block => {
        const parentPre = block.parentElement as HTMLPreElement;
        if (parentPre) {
          const isDark = customBackgroundColor?.toLowerCase().includes('#1') || 
                         selectedStyle.styles.backgroundColor?.toString()?.toLowerCase().includes('#1');
          
          parentPre.style.backgroundColor = isDark ? '#2d2d2d' : '#f5f5f5';
          parentPre.style.color = isDark ? '#d4d4d4' : '#333333';
          parentPre.style.border = `1px solid ${isDark ? '#444' : '#ddd'}`;
          parentPre.style.borderRadius = '5px';
          parentPre.style.padding = '1em';
          parentPre.style.overflow = 'auto';
          parentPre.style.fontFamily = '"Roboto Mono", monospace';
          parentPre.style.fontSize = '0.9em';
          parentPre.style.lineHeight = '1.5';
          parentPre.style.margin = '1em 0';
        }
      });
      
      const htmlContent = clonedCard.outerHTML;
      
      const textarea = document.createElement('textarea');
      textarea.value = htmlContent;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      
      alert(t.alertCopiedToWeChat);
    } catch (error) {
      console.error('Copy for WeChat failed:', error);
      alert(t.alertCopyWeChatFailed);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUploadedImage(result);
    };
    reader.readAsDataURL(file);
  };

  const handleFontUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const supportedFormats = ['ttf', 'otf', 'woff', 'woff2'];
    
    if (!fileExtension || !supportedFormats.includes(fileExtension)) {
      alert(t.alertUnsupportedFormat);
      return;
    }

    const fontName = file.name.replace(/\.[^/.]+$/, "");
    
    if (uploadedFonts.some(font => font.name === fontName)) {
      alert(t.alertFontExists(fontName));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      
      let format = '';
      switch (fileExtension) {
        case 'ttf': format = 'truetype'; break;
        case 'otf': format = 'opentype'; break;
        case 'woff': format = 'woff'; break;
        case 'woff2': format = 'woff2'; break;
        default: format = 'truetype';
      }
      
      const newFont: UploadedFont = {
        name: fontName,
        dataUrl: result,
        format: format
      };
      
      setUploadedFonts(prev => [...prev, newFont]);
      setAvailableFonts(prev => [...prev, `"${fontName}", sans-serif`]);
      setCustomFontFamily(`"${fontName}", sans-serif`);
      alert(t.alertFontUploaded(fontName));
    };
    reader.readAsDataURL(file);
  };

  const handleCreateNewStyle = () => {
    setShowCustomStyleModal(true);
  };

  const handleSaveCustomStyle = () => {
    if (!customStyleName.trim()) {
      return;
    }

    try {
      const styleObj: React.CSSProperties = {};
      const cssRules = customStyleCSS.split(';');
      
      cssRules.forEach(rule => {
        const [property, value] = rule.split(':').map(s => s.trim());
        if (property && value) {
          const camelProperty = property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
          (styleObj as any)[camelProperty] = value;
        }
      });
      
      const newStyle: CardStyle = {
        name: customStyleName,
        styles: styleObj
      };
      
      setCustomStyles(prev => [...prev, newStyle]);
      setSelectedStyle(newStyle);
      setShowCustomStyleModal(false);
      setCustomStyleName("");
      setCustomStyleCSS("");
    } catch (error) {
      console.error('Failed to parse custom CSS:', error);
    }
  };

  const handleCancelCustomStyle = () => {
    setShowCustomStyleModal(false);
    setCustomStyleName("");
    setCustomStyleCSS("");
  };

  const handleMarkdownChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdownInput(e.target.value);
  };

  const handleStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const styleName = e.target.value;
    const style = [...cardStyles, ...customStyles].find(s => s.name === styleName);
    if (style) {
      setSelectedStyle(style);
    }
  };

  const handleFontFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCustomFontFamily(e.target.value);
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomFontSize(e.target.value + "px");
  };

  const handleTextColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomTextColor(e.target.value);
  };

  const handleBackgroundColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomBackgroundColor(e.target.value);
  };

  const handleClearImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCardWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCardWidth(value === "auto" || !value ? "auto" : `${value}px`);
  };

  const handleCardHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCardHeight(value === "auto" || !value ? "auto" : `${value}px`);
  };

  const handleAutoHideOverflowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAutoHideOverflow(e.target.checked);
  };

  const handleSplitModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSplitMode(e.target.value as SplitMode);
  };

  // Toolbar functions
  const insertMarkdown = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('markdown-input') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(end);
    
    const newText = beforeText + prefix + selectedText + suffix + afterText;
    setMarkdownInput(newText);
    
    setTimeout(() => {
      textarea.focus();
      if (selectedText.length > 0) {
        textarea.setSelectionRange(start + prefix.length, end + prefix.length);
      } else {
        textarea.setSelectionRange(start + prefix.length, start + prefix.length);
      }
    }, 0);
  };
  
  const insertHeading = () => insertMarkdown('# ');
  const insertBold = () => insertMarkdown('**', '**');
  const insertItalic = () => insertMarkdown('*', '*');
  const insertStrikethrough = () => insertMarkdown('~~', '~~');
  const insertLink = () => insertMarkdown('[链接文字](', ')');
  const insertImage = () => insertMarkdown('![图片描述](', ')');
  const insertQuote = () => insertMarkdown('> ');
  const insertCode = () => insertMarkdown('`', '`');
  const insertCodeBlock = () => insertMarkdown('\n```javascript\n', '\n```\n');
  const insertUnorderedList = () => insertMarkdown('- ');
  const insertOrderedList = () => insertMarkdown('1. ');
  const insertHorizontalRule = () => insertMarkdown('\n---\n');
  const insertHighlight = () => insertMarkdown('==', '==');
  const insertTable = () => insertMarkdown('| 标题1 | 标题2 | 标题3 |\n| --- | --- | --- |\n| 内容1 | 内容2 | 内容3 |\n| 内容4 | 内容5 | 内容6 |\n');
  const insertEmptyLine = () => insertMarkdown('\n\n');
  const insertEmoji = () => insertMarkdown('😊');

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      // Only apply shortcuts if the target is the markdown textarea
      if (target.id !== 'markdown-input') return;

      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'b':
            e.preventDefault();
            insertBold();
            break;
          case 'i':
            e.preventDefault();
            insertItalic();
            break;
          case 'h':
            e.preventDefault();
            insertHeading();
            break;
          case 'k':
            e.preventDefault();
            insertLink();
            break;
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []); // Empty dependency array ensures this runs only once

  // Calculate current card style
  const currentCardBaseStyle: React.CSSProperties = {
    ...selectedStyle.styles,
    fontFamily: customFontFamily || selectedStyle.styles.fontFamily?.toString(),
    fontSize: customFontSize || selectedStyle.styles.fontSize?.toString(),
    color: customTextColor || selectedStyle.styles.color?.toString(),
    backgroundColor: customBackgroundColor || selectedStyle.styles.backgroundColor?.toString(),
    width: cardWidth,
    height: cardHeight,
    overflow: autoHideOverflow ? 'hidden' : 'visible',
    // Ensure gradients are handled correctly
    background: selectedStyle.styles.background || customBackgroundColor || selectedStyle.styles.backgroundColor?.toString(),
  };

  // Handle background image wrapper
  const cardWrapperStyle: React.CSSProperties = uploadedImage
    ? {
        backgroundImage: `url(${uploadedImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: cardWidth,
        height: cardHeight,
        position: 'relative',
        display: 'flex', // Use flex to center the card inside
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px', // Add padding to the wrapper if needed
        borderRadius: selectedStyle.styles.borderRadius, // Match card border radius
        boxShadow: selectedStyle.styles.boxShadow, // Apply shadow to wrapper
      }
    : {};

  // Adjust card style when there's a background image
  const cardWithBgImageStyle: React.CSSProperties = uploadedImage
    ? {
        ...currentCardBaseStyle,
        // Use a semi-transparent background for the card itself
        backgroundColor: selectedStyle.styles.backgroundColor?.toString()?.toLowerCase().includes('#1') 
                         ? 'rgba(0, 0, 0, 0.75)' 
                         : 'rgba(255, 255, 255, 0.85)',
        // Ensure text color has enough contrast against the semi-transparent bg
        color: selectedStyle.styles.backgroundColor?.toString()?.toLowerCase().includes('#1')
               ? '#f0f0f0' 
               : '#212121',
        width: '100%', // Card takes full width of wrapper
        height: '100%', // Card takes full height of wrapper
        boxShadow: 'none', // Remove shadow from card itself, apply to wrapper
        border: 'none', // Remove border from card itself
      }
    : currentCardBaseStyle;

  // Basic code block styles
  const basicCodeStyles = `
    .markdown-preview pre {
      background-color: ${globalTheme === 'dark' ? '#2d2d2d' : '#f5f5f5'};
      color: ${globalTheme === 'dark' ? '#d4d4d4' : '#333333'};
      border: 1px solid ${globalTheme === 'dark' ? '#444' : '#ddd'};
      border-radius: 5px;
      padding: 1em;
      overflow: auto;
      font-family: "Roboto Mono", monospace, Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono';
      font-size: 0.9em;
      line-height: 1.5;
      margin: 1em 0;
    }
    .markdown-preview code {
      font-family: "Roboto Mono", monospace, Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono';
      background-color: ${globalTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
      color: ${globalTheme === 'dark' ? '#d4d4d4' : '#333333'};
      padding: 0.2em 0.4em;
      border-radius: 3px;
      font-size: 0.9em;
    }
    .markdown-preview pre code {
      background-color: transparent;
      color: inherit;
      padding: 0;
      border-radius: 0;
      font-size: 1em;
    }
  `;

  // 使用useEffect确保样式只在客户端渲染，避免水合错误
  useEffect(() => {
    // 创建样式元素
    const styleElement = document.createElement('style');
    
    // 设置样式内容
    const fontFaces = uploadedFonts.map(font => (
      `@font-face {
        font-family: "${font.name}";
        src: url(${font.dataUrl}) format("${font.format}");
        font-weight: normal;
        font-style: normal;
      }`
    )).join('\n');
    
    styleElement.textContent = fontFaces + basicCodeStyles;
    
    // 添加到文档头部
    document.head.appendChild(styleElement);
    
    // 清理函数
    return () => {
      document.head.removeChild(styleElement);
    };
  }, [uploadedFonts, basicCodeStyles, globalTheme]);

  return (
    <div className={`min-h-screen ${globalTheme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} p-4 transition-colors duration-300`}>
      {/* 样式已通过useEffect添加到document.head */}

      {/* Top Navbar */}
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2 sticky top-0 z-10 bg-opacity-95 backdrop-blur-sm p-2 rounded-lg shadow-sm" style={{backgroundColor: globalTheme === "dark" ? "rgba(17, 24, 39, 0.95)" : "rgba(243, 244, 246, 0.95)"}}>
        <div className="flex items-center">
          <h1 className="text-2xl font-bold mr-4">{t.title}</h1>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={toggleTheme}
            className={`px-3 py-1 rounded ${
              globalTheme === "dark"
                ? "bg-yellow-500 text-gray-900 hover:bg-yellow-400"
                : "bg-gray-700 text-white hover:bg-gray-600"
            } transition-colors duration-200`}
          >
            {globalTheme === "dark" ? t.switchToLightMode : t.switchToDarkMode}
          </button>
          
          <button
            onClick={toggleLanguage}
            className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-400 transition-colors duration-200"
          >
            {language === "en" ? t.switchToChinese : t.switchToEnglish}
          </button>
          
          {markdownSegments.length > 0 && (
            <>
              <button
                onClick={() => exportAsPNG(0)}
                className="px-3 py-1 rounded bg-green-500 text-white hover:bg-green-400 transition-colors duration-200"
              >
                {t.exportPNG}
              </button>
              
              <button
                onClick={() => exportAsSVG(0)}
                className="px-3 py-1 rounded bg-purple-500 text-white hover:bg-purple-400 transition-colors duration-200"
              >
                {t.exportSVG}
              </button>
              
              <button
                onClick={() => copyToClipboard(0)}
                className="px-3 py-1 rounded bg-orange-500 text-white hover:bg-orange-400 transition-colors duration-200"
              >
                {t.copyToClipboard}
              </button>
              
              <button
                onClick={() => copyForWeChat(0)}
                className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-400 transition-colors duration-200"
              >
                {t.copyForWeChat}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-full mx-auto">
        {/* Left Editing Area */}
        <div className="flex flex-col">
          {/* Markdown Toolbar */}
          <div className={`p-2 rounded-t flex flex-wrap gap-1 mb-1 ${
            globalTheme === "dark" ? "bg-gray-700" : "bg-gray-200"
          }`}>
            {/* Toolbar Buttons... (keep existing buttons) */}
            <button onClick={insertHeading} title="标题 (Ctrl+H)" className={`p-1 rounded ${
              globalTheme === "dark" ? "hover:bg-gray-600 text-white" : "hover:bg-gray-300 text-gray-800"
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h16"></path><path d="M4 6h16"></path><path d="M4 18h12"></path></svg>
            </button>
            <button onClick={insertBold} title="粗体 (Ctrl+B)" className={`p-1 rounded ${
              globalTheme === "dark" ? "hover:bg-gray-600 text-white" : "hover:bg-gray-300 text-gray-800"
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 12a4 4 0 0 0 0-8H6v8"></path><path d="M15 20a4 4 0 0 0 0-8H6v8Z"></path></svg>
            </button>
            <button onClick={insertItalic} title="斜体 (Ctrl+I)" className={`p-1 rounded ${
              globalTheme === "dark" ? "hover:bg-gray-600 text-white" : "hover:bg-gray-300 text-gray-800"
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="4" x2="10" y2="4"></line><line x1="14" y1="20" x2="5" y2="20"></line><line x1="15" y1="4" x2="9" y2="20"></line></svg>
            </button>
            <button onClick={insertStrikethrough} title="删除线" className={`p-1 rounded ${
              globalTheme === "dark" ? "hover:bg-gray-600 text-white" : "hover:bg-gray-300 text-gray-800"
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4H8a4 4 0 0 0-4 4v0a4 4 0 0 0 4 4h8a4 4 0 0 1 4 4v0a4 4 0 0 1-4 4H8"></path><line x1="4" y1="12" x2="20" y2="12"></line></svg>
            </button>
            <button onClick={insertHighlight} title="高亮" className={`p-1 rounded ${
              globalTheme === "dark" ? "hover:bg-gray-600 text-white" : "hover:bg-gray-300 text-gray-800"
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 11-6 6v3h9l3-3"></path><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"></path></svg>
            </button>
            <button onClick={insertLink} title="链接 (Ctrl+K)" className={`p-1 rounded ${
              globalTheme === "dark" ? "hover:bg-gray-600 text-white" : "hover:bg-gray-300 text-gray-800"
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
            </button>
            <button onClick={insertImage} title="图片" className={`p-1 rounded ${
              globalTheme === "dark" ? "hover:bg-gray-600 text-white" : "hover:bg-gray-300 text-gray-800"
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
            </button>
            <button onClick={insertQuote} title="引用" className={`p-1 rounded ${
              globalTheme === "dark" ? "hover:bg-gray-600 text-white" : "hover:bg-gray-300 text-gray-800"
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path></svg>
            </button>
            <button onClick={insertCode} title="行内代码" className={`p-1 rounded ${
              globalTheme === "dark" ? "hover:bg-gray-600 text-white" : "hover:bg-gray-300 text-gray-800"
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
            </button>
            <button onClick={insertCodeBlock} title="代码块" className={`p-1 rounded ${
              globalTheme === "dark" ? "hover:bg-gray-600 text-white" : "hover:bg-gray-300 text-gray-800"
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5"></path><path d="M16 12h-4"></path><path d="M12 16v-8"></path><path d="M8 12H4"></path></svg>
            </button>
            <button onClick={insertUnorderedList} title="无序列表" className={`p-1 rounded ${
              globalTheme === "dark" ? "hover:bg-gray-600 text-white" : "hover:bg-gray-300 text-gray-800"
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
            </button>
            <button onClick={insertOrderedList} title="有序列表" className={`p-1 rounded ${
              globalTheme === "dark" ? "hover:bg-gray-600 text-white" : "hover:bg-gray-300 text-gray-800"
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="10" y1="6" x2="21" y2="6"></line><line x1="10" y1="12" x2="21" y2="12"></line><line x1="10" y1="18" x2="21" y2="18"></line><path d="M4 6h1v4"></path><path d="M4 10h2"></path><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path></svg>
            </button>
            <button onClick={insertHorizontalRule} title="分割线" className={`p-1 rounded ${
              globalTheme === "dark" ? "hover:bg-gray-600 text-white" : "hover:bg-gray-300 text-gray-800"
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line></svg>
            </button>
            <button onClick={insertTable} title="表格" className={`p-1 rounded ${
              globalTheme === "dark" ? "hover:bg-gray-600 text-white" : "hover:bg-gray-300 text-gray-800"
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>
            </button>
            <button onClick={insertEmptyLine} title="插入空白行" className={`p-1 rounded ${
              globalTheme === "dark" ? "hover:bg-gray-600 text-white" : "hover:bg-gray-300 text-gray-800"
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 6H3"></path><path d="M21 12H3"></path><path d="M21 18H3"></path></svg>
            </button>
            <button onClick={insertEmoji} title="插入emoji" className={`p-1 rounded ${
              globalTheme === "dark" ? "hover:bg-gray-600 text-white" : "hover:bg-gray-300 text-gray-800"
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
            </button>
          </div>
          
          {/* Markdown Input */}
          <textarea
            id="markdown-input"
            className={`w-full h-[calc(100vh-450px)] p-4 rounded-b border ${
              globalTheme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
            }`}
            value={markdownInput}
            onChange={handleMarkdownChange}
            placeholder={t.markdownPlaceholder}
          ></textarea>

          {/* Control Panel */}
          <div className={`mt-4 p-4 rounded shadow-sm ${
            globalTheme === "dark" ? "bg-gray-800" : "bg-white"
          }`}>
            <div className="grid grid-cols-2 gap-4">
              {/* Row 1: Upload Font, Font Family */}
              <div>
                <label className="block mb-1 text-sm font-medium">
                  {t.uploadFont}
                </label>
                <input
                  type="file"
                  ref={fontInputRef}
                  onChange={handleFontUpload}
                  accept=".ttf,.otf,.woff,.woff2"
                  className={`w-full p-2 rounded border text-sm ${
                    globalTheme === "dark" ? "bg-gray-700 border-gray-600 text-gray-300 file:bg-gray-600 file:text-gray-300 file:border-0 file:rounded file:px-2 file:py-1 file:mr-2" : "bg-gray-50 border-gray-300 text-gray-700 file:bg-gray-200 file:text-gray-700 file:border-0 file:rounded file:px-2 file:py-1 file:mr-2"
                  }`}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  {t.fontFamily}
                </label>
                <select
                  value={customFontFamily}
                  onChange={handleFontFamilyChange}
                  className={`w-full p-2 rounded border ${
                    globalTheme === "dark" ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-300"
                  }`}
                >
                  {availableFonts.map((font) => (
                    <option key={font} value={font}>
                      {font.replace(/"/g, "").split(',')[0]} {/* Show cleaner font name */}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Row 2: Font Size, Text Color */}
              <div>
                <label className="block mb-1 text-sm font-medium">
                  {t.fontSize}
                </label>
                <input
                  type="number"
                  value={parseInt(customFontSize)}
                  onChange={handleFontSizeChange}
                  min="8"
                  max="72"
                  className={`w-full p-2 rounded border ${
                    globalTheme === "dark" ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-300"
                  }`}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  {t.textColor}
                </label>
                <input
                  type="color"
                  value={customTextColor}
                  onChange={handleTextColorChange}
                  className="w-full p-1 h-10 rounded border cursor-pointer"
                  style={{ backgroundColor: globalTheme === 'dark' ? '#555' : '#eee' }} // Background for the color input itself
                />
              </div>
              
              {/* Row 3: Background Image, Background Color */}
              <div>
                <label className="block mb-1 text-sm font-medium">
                  {t.backgroundImage}
                </label>
                <div className="flex">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className={`flex-grow p-2 rounded-l border text-sm ${
                      globalTheme === "dark" ? "bg-gray-700 border-gray-600 text-gray-300 file:bg-gray-600 file:text-gray-300 file:border-0 file:rounded file:px-2 file:py-1 file:mr-2" : "bg-gray-50 border-gray-300 text-gray-700 file:bg-gray-200 file:text-gray-700 file:border-0 file:rounded file:px-2 file:py-1 file:mr-2"
                    }`}
                  />
                  <button
                    onClick={handleClearImage}
                    className="px-3 py-2 rounded-r bg-red-500 text-white hover:bg-red-400 transition-colors duration-200 text-sm"
                  >
                    {t.clearImage}
                  </button>
                </div>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  {t.backgroundColor}
                </label>
                <input
                  type="color"
                  value={customBackgroundColor}
                  onChange={handleBackgroundColorChange}
                  className="w-full p-1 h-10 rounded border cursor-pointer"
                  style={{ backgroundColor: globalTheme === 'dark' ? '#555' : '#eee' }}
                />
              </div>
              
              {/* Row 4: Height, Width */}
              <div>
                <label className="block mb-1 text-sm font-medium">
                  {t.cardHeight}
                </label>
                <input
                  type="text" // Use text to allow 'auto'
                  value={cardHeight}
                  onChange={handleCardHeightChange}
                  placeholder="auto"
                  className={`w-full p-2 rounded border ${
                    globalTheme === "dark" ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-300"
                  }`}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  {t.cardWidth}
                </label>
                <input
                  type="text" // Use text to allow 'auto'
                  value={cardWidth}
                  onChange={handleCardWidthChange}
                  placeholder="auto"
                  className={`w-full p-2 rounded border ${
                    globalTheme === "dark" ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-300"
                  }`}
                />
              </div>
              
              {/* Row 5: Split Mode, Card Style */}
              <div>
                <label className="block mb-1 text-sm font-medium">
                  {t.splitModeLabel}
                </label>
                <select
                  value={splitMode}
                  onChange={handleSplitModeChange}
                  className={`w-full p-2 rounded border ${
                    globalTheme === "dark" ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-300"
                  }`}
                >
                  <option value="long">{t.splitModeLong}</option>
                  {/* <option value="auto">{t.splitModeAuto}</option> */}
                  <option value="hr">{t.splitModeHR}</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  {t.cardStyle}
                </label>
                <select
                  value={selectedStyle.name}
                  onChange={handleStyleChange}
                  className={`w-full p-2 rounded border ${
                    globalTheme === "dark" ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-300"
                  }`}
                >
                  {[...cardStyles, ...customStyles].map((style) => (
                    <option key={style.name} value={style.name}>
                      {style.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Row 6: Auto Hide Overflow, Create New Style */}
              <div>
                <label className="block mb-1 text-sm font-medium">
                  &nbsp; {/* Spacer */} 
                </label>
                <div className={`flex items-center p-2 rounded border h-10 ${
                  globalTheme === "dark" ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-300"
                }`}>
                  <input
                    id="autoHideOverflowCheckbox"
                    type="checkbox"
                    checked={autoHideOverflow}
                    onChange={handleAutoHideOverflowChange}
                    className="h-4 w-4 mr-2 cursor-pointer"
                  />
                  <label htmlFor="autoHideOverflowCheckbox" className="text-sm cursor-pointer select-none">
                    {t.autoHideOverflow}
                  </label>
                </div>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  &nbsp; {/* Spacer */} 
                </label>
                <button
                  onClick={handleCreateNewStyle}
                  className="w-full p-2 rounded bg-blue-500 text-white hover:bg-blue-400 transition-colors duration-200 h-10"
                >
                  {t.createNewStyle}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Preview Area */}
        <div className="flex flex-col h-[calc(100vh-150px)] overflow-auto">
          <div className="flex-grow flex items-center justify-center p-4">
            {markdownSegments.map((segment, index) => (
              <div key={index} className="w-full flex justify-center mb-4 last:mb-0">
                {uploadedImage ? (
                  <div
                    style={cardWrapperStyle}
                    className="relative shadow-lg rounded-lg overflow-hidden"
                  >
                    <div
                      id={`card-preview-${index}`}
                      style={cardWithBgImageStyle}
                      className="markdown-preview p-4" // Add padding inside the card
                      dangerouslySetInnerHTML={{
                        __html: marked(segment),
                      }}
                    ></div>
                  </div>
                ) : (
                  <div
                    id={`card-preview-${index}`}
                    style={currentCardBaseStyle}
                    className="markdown-preview shadow-lg rounded-lg overflow-hidden" // Ensure overflow hidden works with border radius
                    dangerouslySetInnerHTML={{
                      __html: marked(segment),
                    }}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm opacity-70">
        {t.footerText}
      </div>

      {/* Custom Style Modal */}
      {showCustomStyleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`p-6 rounded-lg shadow-lg max-w-lg w-full ${
            globalTheme === "dark" ? "bg-gray-800" : "bg-white"
          }`}>
            <h2 className="text-xl font-bold mb-4">{t.createNewStyle}</h2>
            
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium">
                {t.customStyleName}
              </label>
              <input
                type="text"
                value={customStyleName}
                onChange={(e) => setCustomStyleName(e.target.value)}
                className={`w-full p-2 rounded border ${
                  globalTheme === "dark" ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-300"
                }`}
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium">
                {t.customStyleCSS}
              </label>
              <textarea
                value={customStyleCSS}
                onChange={(e) => setCustomStyleCSS(e.target.value)}
                rows={8}
                placeholder="padding: 20px;\nbackground-color: #f5f5f5;\nborder-radius: 10px;\ncolor: #333;"
                className={`w-full p-2 rounded border font-mono text-sm ${
                  globalTheme === "dark" ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-300"
                }`}
              ></textarea>
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCancelCustomStyle}
                className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-400 transition-colors duration-200"
              >
                {t.cancelStyle}
              </button>
              <button
                onClick={handleSaveCustomStyle}
                disabled={!customStyleName.trim() || !customStyleCSS.trim()} // Disable if name or CSS is empty
                className={`px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-400 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {t.saveStyle}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
