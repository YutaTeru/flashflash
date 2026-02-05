import { Flashcard } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Helper to create card
const createCard = (english: string, japanese: string, category: string): Flashcard => ({
  id: uuidv4(),
  english,
  japanese,
  category,
  isFavorite: false,
});

export const INITIAL_DATA: Flashcard[] = [
  // 語句をつけ加えることによる強調
  createCard("You may not believe me, but I did get full marks on the exam.", "信じないかもしれないけれど、私は本当に試験で満点を取ったんだ。", "強調・倒置・省略"),
  createCard("What in the world is he going to do?", "彼はいったい全体何をするつもりなんだ？", "強調・倒置・省略"),
  createCard("I don't agree to this plan at all.", "私はこの計画には全く賛成しない。", "強調・倒置・省略"),
  createCard("Nice to meet you, Meg. Do sit down.", "はじめまして、メグ。ぜひ座ってください。", "強調・倒置・省略"),
  createCard("How on earth did you come to that conclusion?", "いったいどうしてそんな結論になったの？", "強調・倒置・省略"),
  createCard("Aren't you hungry? — No, (I'm) not (hungry) in the least.", "お腹空いてない？ ― いや、全く（空いてないよ）。", "強調・倒置・省略"),

  // 1-2 強調構文
  createCard("It was John that married Emma in June.", "6月にエマと結婚したのはジョンだった。", "強調構文"),
  createCard("It was Emma that John married in June.", "ジョンが6月に結婚したのはエマだった。", "強調構文"),
  createCard("It was in June that John married Emma.", "ジョンがエマと結婚したのは6月だった。", "強調構文"),

  // 2 倒置表現
  createCard("Never have I heard such a moving speech.", "これほど感動的なスピーチは一度も聞いたことがない。", "倒置表現"),
  createCard("I'm thirsty. — So am I.", "喉が渇いた。― 私もです。", "倒置表現"),
  createCard("I didn't enjoy the show. — Neither [Nor] did I.", "そのショーは楽しめなかった。― 私もです。", "倒置表現"),
  createCard("Only yesterday did I hear the news.", "つい昨日、その知らせを聞いたばかりだ。", "倒置表現"),
  createCard("On the wall hung a large poster.", "壁には大きなポスターが掛かっていた。", "倒置表現"),
  createCard("Money is important, but more important is health.", "お金は大事だが、もっと大事なのは健康だ。", "倒置表現"),

  // 3 省略表現
  createCard("Meg can play the violin, but I can't.", "メグはバイオリンが弾けるが、私は弾けない。", "省略表現"),
  createCard("I don't want to say this to you, but I have to.", "こんなことは言いたくないが、言わなければならない。", "省略表現"),
  createCard("While in college, Bill started his own company.", "大学在学中に、ビルは自分の会社を立ち上げた。", "省略表現"),
  createCard("Contact me anytime, if necessary.", "必要ならいつでも連絡してください。", "省略表現"),
  createCard("I thought Ann was angry with me, but she wasn't.", "アンは私に怒っていると思ったが、そうではなかった。", "省略表現"),

  // 4 挿入表現 / 5 同格表現
  createCard("Kim will, I believe, help me with this project.", "キムは、私の思うところ、この計画を手伝ってくれるだろう。", "挿入・同格"),
  createCard("The news that John had lost the match was a shock to me.", "ジョンが試合に負けたという知らせは、私にとってショックだった。", "挿入・同格"),
  createCard("Mr. Brown, our biology teacher, is very strict with us.", "生物の先生であるブラウン先生は、私たちにとても厳しい。", "挿入・同格"),

  // 6 無生物主語の文
  createCard("The memory of my dog makes me feel happy.", "愛犬の思い出は私を幸せな気分にさせる。", "無生物主語"),
  createCard("My stomachache made me cancel the trip.", "腹痛のせいで旅行をキャンセルした（腹痛が私に旅行をキャンセルさせた）。", "無生物主語"),
  createCard("Her advice enabled me to solve the problem.", "彼女の助言のおかげで、私はその問題を解決できた。", "無生物主語"),
  createCard("The storm prevented us from going on a picnic.", "嵐のせいで私たちはピクニックに行けなかった。", "無生物主語"),
  createCard("This story reminds me of my childhood.", "この物語は私に子供時代を思い出させる。", "無生物主語"),
  createCard("This bus will take you to the airport in one hour.", "このバスに乗れば1時間で空港に着きます。", "無生物主語"),
  createCard("The newspaper says that the economy is recovering slowly.", "新聞によると、経済は徐々に回復しているとのことだ。", "無生物主語"),

  // 7 名詞を中心とした表現（名詞構文）
  createCard("Hiroki is a good singer.", "ヒロキは歌が上手だ（上手な歌手だ）。", "名詞構文"),
  createCard("Take [Have] a look at this picture first.", "まずはこの写真を見てください。", "名詞構文"),
  createCard("I am sure of your success in the experiment.", "私はあなたが実験に成功すると確信している。", "名詞構文"),
  createCard("Rika is a good speaker of German.", "リカはドイツ語を話すのが上手だ。", "名詞構文"),
  createCard("I was happy to hear of the cat's rescue.", "その猫が救助されたと聞いて嬉しかった。", "名詞構文"),
  createCard("Do you know the reason for his anger?", "彼が怒っている理由を知っていますか？", "名詞構文"),

  // UNIT 15 接続詞 - 等位接続詞
  createCard("We grow vegetables and flowers in our garden.", "私たちは庭で野菜と花を育てている。", "接続詞"),
  createCard("Which would you prefer, meat or fish? — I'd prefer fish, please.", "肉と魚、どちらがいいですか？ ― 魚をお願いします。", "接続詞"),
  createCard("May went shopping, but she returned without buying anything.", "メイは買い物に行ったが、何も買わずに戻ってきた。", "接続詞"),
  createCard("We have plenty of time, so you don't have to hurry.", "時間はたっぷりあるから、急ぐ必要はない。", "接続詞"),

  // 等位接続詞の重要構文
  createCard("Both Kate and John are on vacation now.", "ケイトとジョンの両方とも、今休暇中だ。", "接続詞"),
  createCard("This coat is not mine but my sister's.", "このコートは私のものではなく、姉のものだ。", "接続詞"),
  createCard("Not only I but also Haruto is interested in game programming.", "私だけでなくハルトもゲームプログラミングに興味がある。", "接続詞"),
  createCard("You can have either pudding or ice cream for dessert.", "デザートにはプリンかアイスクリームのどちらかをどうぞ。", "接続詞"),
  createCard("My sister plays neither tennis nor soccer. She plays basketball.", "姉はテニスもサッカーもしない。彼女はバスケットボールをする。", "接続詞"),
  createCard("Go straight, and you will see the station.", "まっすぐ行きなさい、そうすれば駅が見えます。", "接続詞"),
  createCard("Put on your coat, or you'll catch a cold.", "コートを着なさい、さもないと風邪をひきますよ。", "接続詞"),

  // 従属接続詞（名詞節）
  createCard("It is clear that the system has a problem.", "そのシステムに問題があるのは明らかだ。", "接続詞"),
  createCard("The fact is that I have never been abroad.", "実は私は一度も海外に行ったことがない。", "接続詞"),
  createCard("I hope that you'll like my present.", "あなたが私のプレゼントを気に入ってくれるといいのですが。", "接続詞"),
  createCard("We were surprised at the news that Aya won the dance contest.", "アヤがダンスコンテストで優勝したという知らせに私たちは驚いた。", "接続詞"),
  createCard("It doesn't matter to me whether[if] his story is true or not.", "彼の話が本当かどうかは、私には重要ではない。", "接続詞"),
  createCard("The question is whether my friends will agree to my plan.", "問題は、友人たちが私の計画に賛成してくれるかどうかだ。", "接続詞"),
  createCard("I don't know whether[if] Kenta is at home or at school.", "ケンタが家にいるのか学校にいるのかわからない。", "接続詞"),

  // 従属接続詞（副詞節）
  createCard("We'll always help you when you're in trouble.", "あなたが困っている時はいつでも助けますよ。", "接続詞"),
  createCard("Jim cooked dinner while his baby was sleeping.", "ジムは赤ちゃんが眠っている間に夕食を作った。", "接続詞"),
  createCard("Just as I was leaving the store, I saw this dress.", "ちょうど店を出ようとした時に、このドレスを見かけた。", "接続詞"),
  createCard("Don't forget to feed the cats before you go out.", "出かける前に猫に餌をやるのを忘れないで。", "接続詞"),
  createCard("We went to karaoke after we finished our club activities.", "部活が終わった後、私たちはカラオケに行った。", "接続詞"),
  createCard("I've had a headache since I woke up this morning.", "今朝起きてからずっと頭痛がする。", "接続詞"),
  createCard("Could you wait here until my mother is back?", "母が戻るまでここで待っていてくれませんか？", "接続詞"),
  createCard("I'll finish my homework by the time you come.", "あなたが来る時までには宿題を終えておきます。", "接続詞"),
  createCard("The tall man ran away as soon as he saw the police officer.", "その背の高い男は警官を見るやいなや逃げ出した。", "接続詞"),
  createCard("Please stop by at our house if you have time.", "もし時間があれば私たちの家に寄ってください。", "接続詞"),
  createCard("You won't catch the bus unless you leave at once.", "すぐに出発しないとバスに間に合いませんよ。", "接続詞"),
  createCard("You'll be fine as[so] long as you relax.", "リラックスしている限り大丈夫ですよ。", "接続詞"),
  createCard("Everything was covered with snow as[so] far as the eye could see.", "見渡す限りすべてが雪に覆われていた。", "接続詞"),
  createCard("I'm very hungry because I skipped breakfast.", "朝食を抜いたのでとてもお腹が空いている。", "接続詞"),
  createCard("Since you have a fever, you should not go out today.", "熱があるのだから、今日は外出しないほうがいい。", "接続詞"),
  createCard("As it snowed heavily, the road was closed.", "大雪が降ったので、道路は閉鎖された。", "接続詞"),
  createCard("Try to move your body as I tell you.", "私が言う通りに体を動かしてみて。", "接続詞"),
  createCard("I studied late into the night yesterday, though I was very sleepy.", "昨日はとても眠かったが、夜遅くまで勉強した。", "接続詞"),
  createCard("Whether we win or lose the next game, it'll be our last one.", "次の試合に勝とうが負けようが、それが最後になる。", "接続詞"),
  createCard("He spoke English slowly so that we could understand him.", "私たちが理解できるように、彼はゆっくり英語を話した。", "接続詞"),
  createCard("You should take a charger with you in case your phone dies.", "電話の充電が切れた時のために、充電器を持っていくべきだ。", "接続詞"),
  createCard("The movie is so wonderful that you should not miss it.", "その映画はとても素晴らしいので、見逃すべきではない。", "接続詞"),
  createCard("I don't get enough exercise these days, so (that) I've started jogging.", "最近運動不足なので、ジョギングを始めた。", "接続詞"),

  // 覚えておくべき接続詞の形
  createCard("The tall man had no sooner seen the police officer than he ran away.", "その男は警官を見るやいなや逃げ出した（no sooner ... than）。", "接続詞"),
  createCard("The moment the tall man saw the police officer, he ran away.", "その男は警官を見た瞬間に逃げ出した。", "接続詞"),
  createCard("Every time I watch a movie, I feel like eating popcorn.", "映画を見るたびに、ポップコーンが食べたくなる。", "接続詞"),
];
