from database import engine
from sqlalchemy import text
import json

def convert(val):
    if not val:
        return {"en": "", "ru": "", "et": ""}
    if isinstance(val, dict):
        return val
    try:
        parsed = json.loads(val)
        if isinstance(parsed, dict) and "en" in parsed:
            return parsed
    except:
        pass
    return {"en": val, "ru": val, "et": val}

with engine.connect() as conn:
    result = conn.execute(text("SELECT id, about, experience, education, skills FROM cv"))
    for row in result:
        cv_id = row[0]
        about = row[1]
        exp = row[2]
        edu = row[3]
        skills = row[4]

        about_new = json.dumps(convert(about))
        exp_new = json.dumps(convert(exp))
        edu_new = json.dumps(convert(edu))
        
        skills_new_arr = []
        if skills:
            try:
                skills_parsed = json.loads(skills) if isinstance(skills, str) else skills
                for skill in skills_parsed:
                    if "description" in skill:
                        desc = skill["description"]
                        if not isinstance(desc, dict):
                            skill["description"] = {"en": desc, "ru": desc, "et": desc}
                    skills_new_arr.append(skill)
            except Exception as e:
                print("Skills error", e)
        
        skills_new = json.dumps(skills_new_arr)
        conn.execute(text("UPDATE cv SET about=:a, experience=:b, education=:c, skills=:d WHERE id=:e"), 
            {"a": about_new, "b": exp_new, "c": edu_new, "d": skills_new, "e": cv_id})

    conn.commit()
    print("Migration successful")
