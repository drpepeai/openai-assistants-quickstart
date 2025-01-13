export let assistantId = "asst_WDGFYmiT6vaDMvIYlt8MEsrZ"; // set your assistant ID here

if (assistantId === "") {
  assistantId = process.env.OPENAI_ASSISTANT_ID;
}
