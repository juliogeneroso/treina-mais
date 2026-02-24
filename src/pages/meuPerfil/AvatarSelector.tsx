import { Avatar, Box, Grid, Typography } from "@mui/material";
import avatar01 from "../../assets/avatar/avatar_01.png";
import avatar02 from "../../assets/avatar/avatar_02.png";
import avatar03 from "../../assets/avatar/avatar_03.png";
import avatar04 from "../../assets/avatar/avatar_04.png";
import avatar05 from "../../assets/avatar/avatar_05.png";
import avatar06 from "../../assets/avatar/avatar_06.png";
import avatar07 from "../../assets/avatar/avatar_07.png";
import avatar08 from "../../assets/avatar/avatar_08.png";
import avatar09 from "../../assets/avatar/avatar_09.png";
import avatar10 from "../../assets/avatar/avatar_10.png";
import avatar11 from "../../assets/avatar/avatar_11.png";
import avatar12 from "../../assets/avatar/avatar_12.png";

export const avatarMap: Record<string, string> = {
  avatar_01: avatar01,
  avatar_02: avatar02,
  avatar_03: avatar03,
  avatar_04: avatar04,
  avatar_05: avatar05,
  avatar_06: avatar06,
  avatar_07: avatar07,
  avatar_08: avatar08,
  avatar_09: avatar09,
  avatar_10: avatar10,
  avatar_11: avatar11,
  avatar_12: avatar12,
};

const avatarOptions = Object.entries(avatarMap).map(([code, src]) => ({
  code,
  src,
}));

interface AvatarSelectorProps {
  value: string;
  onChange: (code: string) => void;
}

export const AvatarSelector = ({ value, onChange }: AvatarSelectorProps) => {
  return (
    <Box>
      <Typography variant="subtitle1" mb={2} fontWeight={600}>
        Escolha seu avatar
      </Typography>
      <Grid container spacing={2}>
        {avatarOptions.map((avatar) => {
          const selected = value === avatar.code;
          return (
            <Grid sx={{ xs: 3, sm: 2, md: 1 }} key={avatar.code}>
              <Box
                onClick={() => onChange(avatar.code)}
                sx={{
                  cursor: "pointer",
                  borderRadius: "50%",
                  borderWidth: 2,
                  borderStyle: "solid",
                  borderColor: selected ? "primary.main" : "transparent",
                  p: 0.5,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  transition: "all 0.15s ease-in-out",
                  "&:hover": {
                    borderColor: selected ? "primary.main" : "action.hover",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Avatar
                  src={avatar.src}
                  alt={avatar.code}
                  sx={{ width: 70, height: 70 }}
                />
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};
