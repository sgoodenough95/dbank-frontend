import { FC } from "react";

import { Layout, Typography } from "antd";

const { Footer } = Layout;
const { Text } = Typography;

const styles = {
  footer: {
    position: "fixed",
    textAlign: "center",
    width: "100%",
    bottom: "0",
    backgroundColor: "transparent"
  }
} as const;

const CustomFooter: FC = () => {
  return (
    <Footer style={styles.footer}>
      <Typography>
        <Text>
          Join the waitlist at{" "}
          <a href="https://profile.io" target="_blank" rel="noopener noreferrer">
            profile.io
          </a>
        </Text>
      </Typography>
    </Footer>
  );
};

export default CustomFooter;
