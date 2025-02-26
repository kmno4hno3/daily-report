import type React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/shared/ui/accordion";

export const Help: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">ヘルプ</h2>

      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>日報の作成方法は？</AccordionTrigger>
          <AccordionContent>
            左側のナビゲーションバーにある「+」アイコンをクリックし、新規作成画面で日付、タイトル、内容を入力して作成できます。
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>過去の日報を確認するには？</AccordionTrigger>
          <AccordionContent>
            サイドバーの年月をクリックすると、その月の日報一覧が表示されます。さらに個別の日報をクリックすると、詳細を確認できます。
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>設定の変更方法は？</AccordionTrigger>
          <AccordionContent>
            左側のナビゲーションバーにある歯車アイコンをクリックすると、設定画面が開きます。ここでユーザー名やメールアドレスなどを変更できます。
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
