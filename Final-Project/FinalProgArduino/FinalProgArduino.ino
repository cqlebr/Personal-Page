const int buttonPin = 2;
const int redPin = 7;
const int yellowPin = 8;
const int greenPin = 9;

void setup() {
  pinMode(buttonPin, INPUT);
  pinMode(redPin, OUTPUT);
  pinMode(yellowPin, OUTPUT);
  pinMode(greenPin, OUTPUT);

  Serial.begin(9600);
}

void loop() {
  // Send signal to p5 when button is pressed
  if (digitalRead(buttonPin) == HIGH) {
    Serial.println("BUTTON");
    delay(200); // debounce
  }

  // Wait for color from p5
  if (Serial.available() > 0) {
    char incoming = Serial.read();

    // Turn off all LEDs
    digitalWrite(redPin, LOW);
    digitalWrite(yellowPin, LOW);
    digitalWrite(greenPin, LOW);

    // Light one based on input
    if (incoming == 'R') {
      digitalWrite(redPin, HIGH);
    } else if (incoming == 'Y') {
      digitalWrite(yellowPin, HIGH);
    } else if (incoming == 'G') {
      digitalWrite(greenPin, HIGH);
    }
  }
}
