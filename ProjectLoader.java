import java.io.File;
import java.io.IOException;
import java.util.Scanner;

import javax.imageio.ImageIO;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.IOException;

import java.awt.event.KeyEvent;

class ProjectLoader {

    public static ProjectLoader pl = new ProjectLoader();

    private static int selectedOption = 0;
    private static int OPTION_COUNT = 5;

    public static void main(String args[]) {

        pl.generateWelcomeText();

        System.out.println("Select a project to start working on...");

        // pl.selectOption();

        Scanner scanner = new Scanner(System.in);

        int keyCode = scanner.nextLine().charAt(0);

        System.out.println(keyCode);

    }

    

    private static void displayOptions() {
        for (int i = 0; i < 5; i++) {
            if (i == selectedOption) {
                System.out.print("> "); // Add arrow indicator for selected option
            } else {
                System.out.print("  ");
            }
            System.out.println("Option " + (i + 1));
        }
    }

    String generateWelcomeText() {

        String text = "Hii, \n" ;

        System.out.println(text);
        pl.printNameArt(System.getProperty("user.name").toUpperCase());
        System.out.println();
        System.out.println("Ready to get things done?");
        System.out.println();
        
        return text;

    }

    private static void selectOption() {
        displayOptions();

        // Read keyboard input
        Scanner scanner = new Scanner(System.in);
        while (true) {
            int keyCode = scanner.nextLine().charAt(0);

            if (keyCode == KeyEvent.VK_UP) {
                selectedOption = (selectedOption - 1 + OPTION_COUNT) % OPTION_COUNT;
                displayOptions();
            } else if (keyCode == KeyEvent.VK_DOWN) {
                selectedOption = (selectedOption + 1) % OPTION_COUNT;
                displayOptions();
            } else if (keyCode == KeyEvent.VK_ENTER) {
                System.out.println("Selected option: " + (selectedOption + 1));
                // Perform actions based on the selected option
                // Add your code here
                break;
            }
        }
        scanner.close();
    }

    void printNameArt(String text) {

        try {

            int width = 80;
            int height = 20;

            // BufferedImage image = ImageIO.read(new
            // File("/Users/mkyong/Desktop/logo.jpg"));
            BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
            Graphics g = image.getGraphics();
            g.setFont(new Font("SansSerif", Font.PLAIN, 10));

            Graphics2D graphics = (Graphics2D) g;
            graphics.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING,
                    RenderingHints.VALUE_TEXT_ANTIALIAS_ON);
            graphics.drawString(text, 0, 10);

            // save this image
            // ImageIO.write(image, "png", new File("/users/mkyong/ascii-art.png"));
 
            for (int y = 0; y < height; y++) {
                StringBuilder sb = new StringBuilder();
                for (int x = 0; x < width; x++) {

                    sb.append(image.getRGB(x, y) == -16777216 ? " " : "%");

                }

                if (sb.toString().trim().isEmpty()) {
                    continue;
                }

                System.out.println(sb);

            }
 

        } catch (Exception e) {

            System.out.println(text.toUpperCase());

        }

    }

}