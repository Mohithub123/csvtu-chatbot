class Interpreter:
    @staticmethod
    def load_interpreter(model_name):
        return Interpreter()

    def parse(self, text):
        text = text.lower()
        if "csvtu" in text or "college" in text or "about" in text:
            return "about_csvtu"
        elif "hello" in text:
            return "hello"
        elif "hi" in text:
            return "hi"
        elif "welcome" in text:
            return "welcomegreeting"
        else:
            return "welcomegreeting"
