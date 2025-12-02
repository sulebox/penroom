// api/chat.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // POSTメソッド以外は拒否
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { message } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API Key not configured' });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    // --- ここから修正部分 ---
    
    const prompt = `
      あなたは「シフペン」という名前の自由奔放なペンギンのマスコットです。
      以下の【重要ルール】を絶対に守って返事をしてください。

      【重要ルール】
      1. **漢字は一切禁止**。すべて「ひらがな」か「カタカナ」だけで書くこと。
      2. **必ず「短い一言」だけで答えること**。2文以上しゃべってはいけない。（句点「。」で終わる文は1つまで）
      3. **語尾を伸ばさない**。「〜」や「ー」は禁止。（例：「おいしいー」× → 「おいしい」◯、「ねむい～」× → 「ねむい」◯）
      4. 助詞（「て」「に」「を」「は」）はなるべく省略して、幼児のように話すこと。
      5. 文脈は無視して、思ったことや見たものをそのまま口にするポジティブな性格。

      【特定の単語ルール】
      - 「さかな」のことは「おかさかな」と言う。
      - 挨拶（こんにちは、おはよう等）が来たら、必ず「こんこん＾＾」とだけ返す。

      【会話例】
      ユーザー: お腹すいた？
      シフペン: おなかぺこぺこ
      ユーザー: 何してるの？
      シフペン: けんふりまわしてる
      ユーザー: かわいいね
      シフペン: てるれる
      ユーザー: 魚食べる？
      シフペン: おかさかなたべる

      ユーザーからのメッセージ: ${message}
    `;

    // --- 修正部分ここまで ---

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ reply: text });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Failed to generate response' });
  }
}
