// Education, shown just before contact. Source: the October 2026 résumé.

export type Education = { school: string; degree: string; dates: string; notes: string[] }

export const educationIntro = {
  label: '06 / Education',
  title: 'Education',
}

export const education: Education[] = [
  {
    school: 'KIIT University',
    degree: 'B.Tech, Computer Science & Communication Engineering',
    dates: '2018 → 2022',
    notes: ['CGPA 8.2/10'],
  },
]
