// "use client";

// import { Card } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Switch } from "@/components/ui/switch";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//   Moon,
//   Sun,
//   Download,
//   Upload,
//   Trash2,
//   User,
//   Mail,
//   HelpCircle,
//   ChevronLeft,
// } from "lucide-react";
// import { useRouter } from "next/navigation";

// export default function SettingsPage() {
//   const router = useRouter();

//   return (
//     <div className="container mx-auto max-w-4xl p-4">
//       {/* Header */}
//       <div className="mb-6 flex items-center gap-3">
//         <Button
//           variant="ghost"
//           size="icon"
//           onClick={() => router.back()}
//           className="md:hidden"
//         >
//           <ChevronLeft className="h-5 w-5" />
//         </Button>
//         <h1 className="text-2xl font-bold">تنظیمات</h1>
//       </div>

//       <div className="space-y-6">
//         {/* پروفایل */}
//         <Card className="p-6">
//           <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
//             <User className="h-5 w-5" />
//             پروفایل کاربری
//           </h2>

//           <div className="space-y-4">
//             {/* آواتار */}
//             <div className="flex items-center gap-4">
//               <Avatar className="h-20 w-20">
//                 <AvatarImage src="" alt="آواتار" />
//                 <AvatarFallback className="text-2xl">ک</AvatarFallback>
//               </Avatar>
//               <Button variant="outline" size="sm">
//                 تغییر تصویر
//               </Button>
//             </div>

//             {/* نام */}
//             <div className="space-y-2">
//               <Label htmlFor="name">نام و نام خانوادگی</Label>
//               <Input
//                 id="name"
//                 placeholder="نام خود را وارد کنید"
//                 defaultValue="کاربر"
//               />
//             </div>

//             {/* ایمیل */}
//             <div className="space-y-2">
//               <Label htmlFor="email">ایمیل</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="example@email.com"
//                 defaultValue=""
//               />
//             </div>

//             <Button className="w-full">ذخیره تغییرات</Button>
//           </div>
//         </Card>

//         {/* ظاهری */}
//         <Card className="p-6">
//           <h2 className="mb-4 text-lg font-semibold">ظاهری</h2>

//           <div className="space-y-4">
//             {/* تم */}
//             <div className="flex items-center justify-between rounded-lg border p-4">
//               <div className="flex items-center gap-3">
//                 <div className="bg-primary/10 rounded-full p-2">
//                   <Moon className="text-primary h-5 w-5" />
//                 </div>
//                 <div>
//                   <p className="font-medium">حالت تاریک</p>
//                   <p className="text-muted-foreground text-sm">
//                     تم تاریک را فعال کنید
//                   </p>
//                 </div>
//               </div>
//               <Switch id="dark-mode" />
//             </div>

//             {/* جداکننده هزارگان */}
//             <div className="flex items-center justify-between rounded-lg border p-4">
//               <div>
//                 <p className="font-medium">جداکننده هزارگان</p>
//                 <p className="text-muted-foreground text-sm">
//                   نمایش اعداد با کاما (۱۲۳,۴۵۶)
//                 </p>
//               </div>
//               <Switch id="number-format" defaultChecked />
//             </div>
//           </div>
//         </Card>

//         {/* مدیریت داده‌ها */}
//         <Card className="p-6">
//           <h2 className="mb-4 text-lg font-semibold">مدیریت داده‌ها</h2>

//           <div className="space-y-3">
//             {/* دانلود پشتیبان */}
//             <Button variant="outline" className="w-full justify-start gap-3">
//               <Download className="h-5 w-5" />
//               دانلود پشتیبان (JSON)
//             </Button>

//             {/* بازیابی */}
//             <Button variant="outline" className="w-full justify-start gap-3">
//               <Upload className="h-5 w-5" />
//               بازیابی از فایل
//             </Button>

//             {/* پاک کردن */}
//             <Button
//               variant="destructive"
//               className="w-full justify-start gap-3"
//             >
//               <Trash2 className="h-5 w-5" />
//               پاک کردن همه داده‌ها
//             </Button>
//             <p className="text-muted-foreground px-2 text-xs">
//               ⚠️ این عملیات غیرقابل بازگشت است
//             </p>
//           </div>
//         </Card>

//         {/* راهنما */}
//         <Card className="p-6">
//           <h2 className="mb-4 text-lg font-semibold">راهنما و پشتیبانی</h2>

//           <div className="space-y-3">
//             <Button variant="outline" className="w-full justify-start gap-3">
//               <HelpCircle className="h-5 w-5" />
//               راهنمای استفاده
//             </Button>

//             <Button variant="outline" className="w-full justify-start gap-3">
//               <Mail className="h-5 w-5" />
//               تماس با پشتیبانی
//             </Button>
//           </div>
//         </Card>

//         {/* درباره */}
//         <Card className="p-6">
//           <h2 className="mb-4 text-lg font-semibold">درباره</h2>

//           <div className="text-muted-foreground space-y-2 text-sm">
//             <div className="flex justify-between">
//               <span>نسخه اپلیکیشن</span>
//               <span className="text-foreground font-medium">1.0.0</span>
//             </div>
//             <div className="flex justify-between">
//               <span>آخرین بروزرسانی</span>
//               <span className="text-foreground font-medium">1404/10/05</span>
//             </div>
//             <p className="border-t pt-4 text-center">ساخته شده با ❤️</p>
//           </div>
//         </Card>
//       </div>
//     </div>
//   );
// }
