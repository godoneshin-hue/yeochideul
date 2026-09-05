# 여치: 스마트 스킨케어

import streamlit as st
import pandas as pd
import numpy as np
import time
import random
import base64
from datetime import datetime, timedelta
from PIL import Image
import io

# Plotly 예외 처리
try:
    import plotly.graph_objects as go
    import plotly.express as px
    PLOTLY_AVAILABLE = True
except ImportError:
    PLOTLY_AVAILABLE = False

# 페이지 설정
st.set_page_config(
    page_title="여치들 - 스마트 스킨케어",
    page_icon="🍊",
    layout="centered",
    initial_sidebar_state="collapsed"
)

# ----------------- 세션 상태 초기화 -----------------
if 'page' not in st.session_state:
    st.session_state.page = 'login'
if 'user_info' not in st.session_state:
    st.session_state.user_info = {
        'name': '사용자',
        'emoji': '🍊',
        'theme_color': '#FF8C00',
        'email': '',
        'password': '',
        'age': 25,
        'gender': '여성',
        'height': 165,
        'weight': 50,
        'skin_type': '건성',
        'survey_completed': False,
        'q1': '좁쌀 여드름',
        'q_diet': '한식 위주',
        'q_sleep': '7시간',
        'profile_pic': None,
        'custom_banners': [],
        'show_celebration': False,
        'patch_history': [],
        'diary_records': {}, # {date_str: {'img': bytes, 'desc': str, 'products': list, 'score': int}}
        'cosmetic_expiry': [], # [{'name': str, 'open_date': date, 'expiry_months': int}]
        'community_posts': [
            {'user': '꿀피부희망', 'content': '어성초 토너 쓰고 좁쌀 많이 들어갔어요!', 'likes': 12, 'comments': 5},
            {'user': '여드름탈출', 'content': '패치 붙이고 자면 다음날 확실히 가라앉네요.', 'likes': 8, 'comments': 2}
        ],
        'habits': {'water': 0, 'sleep': 0},
        'skin_score_history': [85, 82, 88, 84, 90, 87, 92]
    }

# 현재 메인 컬러 가져오기
main_color = st.session_state.user_info['theme_color']

# ----------------- 방대한 제품 데이터베이스 -----------------
PRODUCT_DB = {
    "토너": [
        {"name": "아누아 어성초 77 진정 토너", "brand": "Anua", "ingredients": "어성초추출물(77%), 병풀추출물, 판테놀", "effect": "피부 진정 및 유수분 밸런스 조절", "reviews": ["좁쌀 여드름에 효과 최고예요!", "물 제형이라 산뜻해요.", "성분이 착해서 믿고 써요."], "score": 4.9, "price": "25,000원"},
        {"name": "라운드랩 1025 독도 토너", "brand": "Round Lab", "ingredients": "해수, 판테놀, 알란토인, 베타인", "effect": "저자극 각질 케어 및 수분 공급", "reviews": ["자극 없이 순해서 매일 써요.", "피부 결이 매끈해졌어요.", "가성비 갑 토너입니다."], "score": 4.8, "price": "15,000원"},
        {"name": "넘버즈인 3번 결광가득 에센스 토너", "brand": "numbuzin", "ingredients": "50가지 발효성분, 나이아신아마이드, 아데노신", "effect": "피부 광채 및 결 개선", "reviews": ["화장이 잘 먹는 피부가 돼요.", "에센스처럼 쫀쫀해요.", "피부 컨디션 안 좋을 때 필수!"], "score": 4.7, "price": "22,000원"},
        {"name": "라운드랩 자작나무 수분 토너", "brand": "Round Lab", "ingredients": "자작나무 수액, 비타 히알루론산, 글리세릴글루코사이드", "effect": "깊은 수분 공급 및 보습막 형성", "reviews": ["속건조 잡는 데 이만한 게 없어요.", "촉촉함이 오래가요.", "흡수가 정말 빨라요."], "score": 4.8, "price": "18,000원"},
        {"name": "에스트라 아토베리어365 하이드로 에센스", "brand": "AESTURA", "ingredients": "BMF11, 아미노산, 스쿠알란", "effect": "피부 장벽 강화 및 진정 보습", "reviews": ["민감성 피부에 강추합니다.", "장벽이 튼튼해지는 느낌이에요.", "인생 토너를 찾았습니다."], "score": 4.9, "price": "28,000원"}
    ],
    "에센스": [
        {"name": "토리든 다이브인 저분자 히알루론산 세럼", "brand": "Torriden", "ingredients": "5D 복합 히알루론산, 판테놀, 마데카소사이드", "effect": "속보습 개선 및 수분 진정", "reviews": ["수분 앰플계의 혁명입니다.", "끈적임 없이 쏙 흡수돼요.", "벌써 5통째 쓰고 있어요."], "score": 4.9, "price": "18,000원"},
        {"name": "아이소이 잡티세럼", "brand": "isoi", "ingredients": "불가리안 로즈 오일, 알부틴, 어성초추출물", "effect": "잡티 케어 및 피부톤 개선", "reviews": ["여드름 흉터가 연해졌어요.", "향이 너무 좋아요.", "피부가 맑아지는 게 느껴져요."], "score": 4.8, "price": "29,500원"},
        {"name": "구달 청귤 비타C 잡티 세럼", "brand": "goodal", "ingredients": "청귤추출물(70%), 비타민C 유도체, 나이아신아마이드", "effect": "생기 부여 및 잡티 완화", "reviews": ["피부가 환해지는 게 보여요.", "비타민 세럼인데 순해요.", "꾸준히 쓰니 효과가 나타나요."], "score": 4.7, "price": "24,000원"},
        {"name": "코스알엑스 어드벤스드 스네일 96 뮤신 에센스", "brand": "COSRX", "ingredients": "달팽이점액여과물(96%), 소듐하이알루로네이트", "effect": "피부 재생 및 영양 공급", "reviews": ["피부 결이 정말 좋아졌어요.", "쫀득쫀득한 제형이 매력적이에요.", "피부 자생력이 좋아진 듯해요."], "score": 4.8, "price": "16,800원"},
        {"name": "에스네이처 아쿠아 스쿠알란 세럼", "brand": "S.NATURE", "ingredients": "스쿠알란, 베타인, 판테놀", "effect": "수분 밀착 보습 및 윤기 부여", "reviews": ["광채가 장난 아니에요.", "건성 피부 필수템입니다.", "화장 전에 바르면 꿀피부 돼요."], "score": 4.9, "price": "26,000원"}
    ],
    "앰플": [
        {"name": "스킨1004 센텔라 앰플", "brand": "SKIN1004", "ingredients": "병풀추출물(100%)", "effect": "강력한 진정 및 장벽 케어", "reviews": ["순수 병풀이라 너무 순해요.", "붉은기 잡는 데 최고!", "피부가 편안해져요."], "score": 4.9, "price": "14,900원"},
        {"name": "웰라쥬 리얼 히알루로닉 블루 100 앰플", "brand": "Wellage", "ingredients": "순수 히알루론산, 판테놀, 베타글루칸", "effect": "100시간 보습 유지", "reviews": ["보습력이 정말 오래가요.", "건조함이 싹 사라졌어요.", "수분감이 팡팡 터져요."], "score": 4.8, "price": "21,000원"},
        {"name": "비플레인 시카풀 앰플 II", "brand": "beplain", "ingredients": "병풀추출물(84%), 마데카소사이드, 알란토인", "effect": "트러블 진정 및 수분 공급", "reviews": ["트러블 났을 때 필수예요.", "흡수력이 정말 빨라요.", "민감할 때마다 찾게 돼요."], "score": 4.7, "price": "19,000원"},
        {"name": "미샤 타임 레볼루션 나이트 리페어 앰플", "brand": "MISSHA", "ingredients": "익스트림 바이옴, 비피다발효여과물", "effect": "안티에이징 및 피부 광채", "reviews": ["다음날 피부가 달라져요.", "영양감이 가득합니다.", "피부 밀도가 쫀쫀해져요."], "score": 4.8, "price": "34,000원"},
        {"name": "닥터자르트 시카페어 세럼", "brand": "Dr.Jart+", "ingredients": "센텔라 RX, 시카본드, 자르트바이옴", "effect": "민감 피부 회복 및 진정", "reviews": ["믿고 쓰는 시카 세럼입니다.", "피부 컨디션 회복에 좋아요.", "자극받은 피부에 딱이에요."], "score": 4.9, "price": "38,000원"}
    ],
    "크림": [
        {"name": "닥터지 레드 블레미쉬 클리어 수딩 크림", "brand": "Dr.G", "ingredients": "5-시카 콤플렉스, 베타글루칸", "effect": "수분 진정 및 여드름성 피부 적합", "reviews": ["여름에도 쓰기 좋은 수분크림!", "트러블이 안 나요.", "수딩 효과가 정말 좋아요."], "score": 4.9, "price": "21,000원"},
        {"name": "일리윤 세라마이드 아토 집중 크림", "brand": "illiyoon", "ingredients": "세라마이드 스킨 콤플렉스, 인삼추출물", "effect": "고보습 장벽 보호", "reviews": ["온 가족이 함께 써요.", "보습 끝판왕입니다.", "가려움증 완화에 좋아요."], "score": 4.8, "price": "12,000원"},
        {"name": "라로슈포제 시카플라스트 밤 B5+", "brand": "LA ROCHE-POSAY", "ingredients": "판테놀, 마데카소사이드, 트리바이오마", "effect": "극민감 피부 손상 케어", "reviews": ["피부 뒤집어졌을 때 구원템.", "연고처럼 쫀쫀해요.", "흉터 케어에도 도움 돼요."], "score": 4.7, "price": "26,000원"},
        {"name": "메디큐브 제로 모공 크림 2.0", "brand": "medicube", "ingredients": "모공 수렴 및 피지 조절 성분", "effect": "모공 수렴 및 피지 조절", "reviews": ["모공이 작아진 것 같아요.", "유분기를 잘 잡아줘요.", "피부 결이 매끈해져요."], "score": 4.8, "price": "28,000원"},
        {"name": "피지오겔 DMT 페이셜 크림", "brand": "Physiogel", "ingredients": "피부 유사 지질 성분(BioMimic 테크놀로지)", "effect": "72시간 철벽 보습", "reviews": ["겨울 필수템입니다.", "장벽이 튼튼해져요.", "속건조가 아예 사라졌어요."], "score": 4.9, "price": "24,500원"}
    ],
    "클렌징": [
        {"name": "마녀공장 퓨어 클렌징 오일", "brand": "manyo", "ingredients": "쌀겨오일, 아르간커넬오일, 호호바씨오일", "effect": "블랙헤드 및 메이크업 세정", "reviews": ["피지가 쏙쏙 빠져요.", "눈 시림이 없어서 좋아요.", "세정력이 정말 완벽해요."], "score": 4.9, "price": "19,000원"},
        {"name": "바닐라코 클린 잇 제로 클렌징 밤", "brand": "BANILA CO", "ingredients": "아세로라 추출물, 온천수", "effect": "강력한 원스텝 세정", "reviews": ["화장이 정말 잘 지워져요.", "밤 제형이라 편해요.", "이중 세안이 필요 없어요."], "score": 4.8, "price": "18,000원"},
        {"name": "라운드어라운드 그린티 약산성 클렌징 폼", "brand": "ROUND A'ROUND", "ingredients": "녹차수, 약산성 성분, 병풀추출물", "effect": "저자극 수분 세안", "reviews": ["세안 후에도 안 당겨요.", "성분이 착해서 좋아요.", "거품이 부드러워요."], "score": 4.7, "price": "12,000원"},
        {"name": "비페스타 클렌징 워터 브라이트닝", "brand": "Bifesta", "ingredients": "흡착성 히알루론산, 비타민C 유도체", "effect": "산뜻한 세정 및 각질 케어", "reviews": ["가볍게 닦아내기 좋아요.", "피부가 맑아지는 느낌.", "잔여감이 없어서 편해요."], "score": 4.8, "price": "14,000원"},
        {"name": "메이크프렘 세이프 미 릴리프 모이스처 클렌징 폼", "brand": "make p:rem", "ingredients": "라즈베리추출물, 코코넛유래세정성분, 판테놀", "effect": "민감 피부 안심 세안", "reviews": ["거품이 정말 쫀쫀해요.", "인생 클렌징폼입니다.", "자극이 하나도 없어요."], "score": 4.9, "price": "14,000원"}
    ]
}

# PRODUCT_LIST는 PRODUCT_DB에서 이름을 추출하여 사용
PRODUCT_LIST = []
for category in PRODUCT_DB.values():
    for product in category:
        PRODUCT_LIST.append(product['name'])

# ----------------- 스타일링 및 CSS (고급화) -----------------
st.markdown(f"""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Pretendard:wght@400;600;800&display=swap');
    
    /* 기본 배경 및 폰트 */
    html, body, [data-testid="stAppViewContainer"] {{
        font-family: 'Pretendard', sans-serif;
        background-color: #F8F9FA;
    }}
    
    /* 모바일 캔버스 */
    .main .block-container {{
        max-width: 420px;
        padding: 0;
        background-color: white;
        margin: auto;
        min-height: 100vh;
        box-shadow: 0 0 50px rgba(0,0,0,0.05);
    }}
    
    /* 헤더 스타일 */
    .app-header {{
        padding: 20px;
        background: white;
        border-bottom: 1px solid #F0F0F0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: sticky;
        top: 0;
        z-index: 1000;
    }}
    
    /* 둥글둥글한 버튼 */
    .stButton>button {{
        border-radius: 20px !important;
        background-color: {main_color} !important;
        color: white !important;
        border: none;
        font-weight: 700;
        width: 100%;
        padding: 14px;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        box-shadow: 0 4px 15px {main_color}30;
    }}
    .stButton>button:active {{
        transform: scale(0.95);
    }}
    
    /* 카드 디자인 */
    .card {{
        background: white;
        border-radius: 24px;
        padding: 20px;
        margin-bottom: 15px;
        border: 1px solid #F0F0F0;
        box-shadow: 0 8px 16px rgba(0,0,0,0.04);
        transition: 0.3s;
    }}
    .card:hover {{
        transform: translateY(-3px);
        box-shadow: 0 12px 24px rgba(0,0,0,0.08);
    }}
    
    /* 애니메이션 효과 */
    @keyframes fadeIn {{ from {{ opacity: 0; transform: translateY(10px); }} to {{ opacity: 1; transform: translateY(0); }} }}
    .fade-in {{ animation: fadeIn 0.5s ease-out forwards; }}
    
    @keyframes heartPop {{ 0% {{ transform: scale(0); opacity: 0; }} 50% {{ transform: scale(1.2); opacity: 1; }} 100% {{ transform: scale(1); opacity: 1; }} }}
    .heart-pop {{ animation: heartPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }}

    /* 패치 인식 가이드 UI */
    .patch-guide {{
        border: 3px dashed {main_color}50;
        border-radius: 50%;
        width: 200px;
        height: 200px;
        margin: 20px auto;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
    }}
    .patch-scan-line {{
        position: absolute;
        width: 100%;
        height: 2px;
        background: {main_color};
        top: 0;
        animation: scan 2s linear infinite;
    }}
    @keyframes scan {{ 0% {{ top: 0; }} 50% {{ top: 100%; }} 100% {{ top: 0; }} }}
    
    /* 하단 탭바 */
    .bottom-nav {{
        position: fixed;
        bottom: 0;
        max-width: 420px;
        width: 100%;
        background: white;
        display: flex;
        justify-content: space-around;
        padding: 12px 0;
        border-top: 1px solid #F0F0F0;
        z-index: 1000;
    }}
    
    /* 축하 애니메이션 */
    @keyframes rise {{ 0% {{ transform: translateY(100vh); opacity: 0; }} 20% {{ opacity: 1; }} 80% {{ opacity: 1; }} 100% {{ transform: translateY(-100vh); opacity: 0; }} }}
    .particle {{ position: fixed; font-size: 40px; z-index: 9999; pointer-events: none; animation: rise 3s ease-out forwards; }}
    
    """, unsafe_allow_html=True)

# ----------------- 유틸리티 함수 -----------------
def set_page(page_name):
    st.session_state.page = page_name
    st.rerun()

def get_base64_image(image_file):
    if image_file:
        return base64.b64encode(image_file.getvalue()).decode()
    return None

def run_celebration():
    if st.session_state.user_info.get('show_celebration'):
        emoji = st.session_state.user_info['emoji']
        particles = "".join([f"

{emoji}

" for _ in range(25)])
        st.markdown(particles, unsafe_allow_html=True)
        st.session_state.user_info['show_celebration'] = False

def show_bottom_nav():
    st.markdown(f"""
    


        

🏠


        

📅


        

📊


        

👥


        

💄


        

👤


    


    """, unsafe_allow_html=True)
    
    cols = st.columns(6)
    icons = ["🏠", "📅", "📊", "👥", "💄", "👤"]
    pages = ['home', 'calendar', 'report', 'community', 'expiry', 'mypage']
    for i, (icon, pg) in enumerate(zip(icons, pages)):
        with cols[i]:
            if st.button(icon, key=f"nav_{pg}", use_container_width=True): set_page(pg)

# ----------------- 페이지 구현 -----------------

def login_page():
    st.markdown("

", unsafe_allow_html=True)
    st.markdown(f"

여치들

", unsafe_allow_html=True)
    st.markdown("

스마트한 여드름 분석 파트너

", unsafe_allow_html=True)
    
    with st.container():
        name = st.text_input("이름", placeholder="이름을 입력하세요", key="login_name")
        password = st.text_input("비밀번호", type="password", placeholder="비밀번호를 입력하세요", key="login_pw")
        
        st.write("")
        if st.button("로그인"):
            if name and password:
                st.session_state.user_info['name'] = name
                if not st.session_state.user_info['survey_completed']: set_page('survey')
                else: set_page('home')
            else: st.error("이름과 비밀번호를 모두 입력해주세요.")
            
        st.markdown("

", unsafe_allow_html=True)
        col1, col2 = st.columns(2)
        with col1:
            if st.button("회원가입하기", key="btn_signup"): set_page('signup')
        with col2:
            if st.button("비밀번호 찾기", key="btn_find_pw"): 
                st.info("가입하신 이메일로 임시 비밀번호가 발송됩니다.")
        st.markdown("

", unsafe_allow_html=True)
    st.markdown("

", unsafe_allow_html=True)

def signup_page():
    st.markdown("

", unsafe_allow_html=True)
    st.markdown(f"

환영합니다!

", unsafe_allow_html=True)
    st.markdown("

여치들과 함께 피부 관리를 시작해볼까요?

", unsafe_allow_html=True)
    
    with st.form("signup_form_complex"):
        st.write("### 👤 기본 정보")
        name = st.text_input("이름 *", placeholder="실명을 입력해주세요")
        email = st.text_input("이메일 *", placeholder="example@mail.com")
        pw = st.text_input("비밀번호 *", type="password", placeholder="8자 이상 입력")
        pw_c = st.text_input("비밀번호 재확인 *", type="password", placeholder="비밀번호를 다시 입력")
        
        st.write("### 🎨 나만의 테마")
        c1, c2 = st.columns(2)
        with c1:
            emoji = st.text_input("대표 이모지", value="🍊", help="나를 표현하는 아이콘이나 특수문자를 넣어보세요!")
        with c2:
            color = st.color_picker("테마 컬러", value="#FF8C00")
            
        st.write("")
        submit = st.form_submit_button("가입하고 피부 진단 시작하기")
        if submit:
            if name and email and pw and pw == pw_c:
                st.session_state.user_info.update({
                    'name': name, 'email': email, 'password': pw,
                    'emoji': emoji, 'theme_color': color
                })
                st.success("가입이 완료되었습니다! 피부 진단으로 이동합니다.")
                time.sleep(1)
                set_page('survey')
            else: st.error("모든 필수 정보를 올바르게 입력해주세요.")
            
    if st.button("이미 계정이 있나요? 로그인하기"): set_page('login')
    st.markdown("", unsafe_allow_html=True)

def survey_page():
    st.markdown(f"

정밀 피부 진단

", unsafe_allow_html=True)
    st.markdown("

", unsafe_allow_html=True)
    
    with st.container():
        st.markdown("

", unsafe_allow_html=True)
        st.write("#### 📊 신체 데이터")
        age = st.number_input("나이", 1, 100, 25, key="sv_age")
        gender = st.radio("성별", ["여성", "남성", "기타"], horizontal=True, key="sv_gender")
        col1, col2 = st.columns(2)
        with col1: height = st.number_input("키 (cm)", 100, 220, 165, key="sv_height")
        with col2: weight = st.number_input("몸무게 (kg)", 30, 150, 55, key="sv_weight")
        st.markdown("

", unsafe_allow_html=True)
        
        st.markdown("

", unsafe_allow_html=True)
        st.write("#### 🌿 라이프스타일")
        diet = st.selectbox("주로 어떤 식단을 하시나요?", ["한식 위주", "육류 위주", "채식 위주", "배달음식/패스트 푸드 위주", "불규칙함"], key="sv_diet")
        sleep = st.select_slider("하루 평균 수면 시간", options=["4시간 이하", "5시간", "6시간", "7시간", "8시간 이상"], value="7시간", key="sv_sleep")
        st.markdown("

", unsafe_allow_html=True)
        
        st.markdown("

", unsafe_allow_html=True)
        st.write("#### 🔍 피부 고민")
        skin = st.selectbox("내 피부 타입은?", ["건성", "복합성", "지성", "민감성","잘 모르겠다"], key="sv_skin")
        q1 = st.selectbox("현재 가장 큰 고민은?", ["좁쌀 여드름", "화농성 여드름", "붉은기", "흉터/색소침착", "건조함","없다"], key="sv_q1")
        st.markdown("

", unsafe_allow_html=True)
        
        if st.button("진단 완료 및 분석 리포트 보기"):
            # BMI 계산 로직 추가
            bmi = weight / ((height/100)**2)
            st.session_state.user_info.update({
                'age': age, 'gender': gender, 'height': height, 'weight': weight,
                'skin_type': skin, 'q1': q1, 'q_diet': diet, 'q_sleep': sleep,
                'survey_completed': True, 'show_celebration': True, 'bmi': round(bmi, 1)
            })
            st.success("진단이 완료되었습니다! 분석 결과를 확인하세요.")
            time.sleep(1)
            set_page('home')
    st.markdown("

", unsafe_allow_html=True)

def home_page():
    run_celebration()
    st.markdown(f"

여치들

", unsafe_allow_html=True)
    st.markdown("

", unsafe_allow_html=True)
    
    ui = st.session_state.user_info
    st.markdown(f"### {ui['emoji']} {ui['name']}님,")
    st.markdown(f"#### **{ui['skin_type']}** 피부타입이라 **{ui['q1']}** 케어가 필요해보여요!")
    
    # 건강 정보 카드
    st.markdown(f"""
    


        

🩺 오늘의 건강 브리핑


        


            BMI 지수: {ui.get('bmi', '20.2')} (정상)

            수면: {ui['q_sleep']} | 식단: {ui['q_diet']}
        


    


    """, unsafe_allow_html=True)
    
    # 생활 습관 추적기 (물/수면)
    st.markdown("### 💧 오늘의 생활 습관")
    cols = st.columns(2)
    with cols[0]:
        st.markdown("

", unsafe_allow_html=True)
        st.write("물 마시기")
        if st.button("🥛 한 잔 추가", key="water_add"): 
            ui['habits']['water'] += 1
            st.rerun()
        st.write(f"현재: {ui['habits']['water']}잔")
        st.markdown("

", unsafe_allow_html=True)
    with cols[1]:
        st.markdown("

", unsafe_allow_html=True)
        st.write("수면 시간")
        sleep_input = st.number_input("시간", 0, 24, ui['habits']['sleep'], key="sleep_in")
        if sleep_input != ui['habits']['sleep']:
            ui['habits']['sleep'] = sleep_input
            st.rerun()
        st.markdown("

", unsafe_allow_html=True)

    # 내 피부 기록하기 (+)
    st.markdown("### 📝 내 피부 기록하기")
    with st.expander("➕ 오늘 피부 기록 남기기", expanded=False):
        d_date = st.date_input("날짜", datetime.now().date(), key="rec_date")
        d_img = st.file_uploader("피부 사진", type=['jpg', 'png'], key="rec_img")
        d_score = st.slider("피부 점수", 0, 100, 80, key="rec_score")
        d_prod = st.multiselect("사용한 제품", PRODUCT_LIST, key="rec_prod")
        d_memo = st.text_area("메모", key="rec_memo")
        if st.button("기록 저장", key="save_record_btn"):
            date_str = d_date.strftime("%Y-%m-%d")
            ui['diary_records'][date_str] = {'img': get_base64_image(d_img), 'products': d_prod, 'memo': d_memo, 'score': d_score}
            st.success("기록 완료!")
            st.rerun()

    # 갤러리 (크기 조절 반영)
    st.markdown("#### 🖼️ 나만의 피부 갤러리")
    if ui['custom_banners']:
        for b in ui['custom_banners']:
            # base64 디코딩하여 이미지 표시
            if isinstance(b['file'], str):
                img_data = base64.b64decode(b['file'])
                st.image(img_data, width=b['size'], caption="내가 꾸민 공간")
            else:
                st.image(b['file'], width=b['size'], caption="내가 꾸민 공간")
    else: st.info("마이페이지에서 사진을 추가해보세요!")
            
    # 핵심 기능: 패치 분석 가이드 UI (중앙 하단 배치)
    st.markdown("


🎯 여드름 패치 정밀 분석

", unsafe_allow_html=True)
    st.markdown(f"""
    


        


            


            🤳
        


        

패치를 부착한 부위를 원 안에 맞춰주세요


    


    """, unsafe_allow_html=True)
    if st.button("분석 시작하기 (카메라)", key="start_analysis_btn"): set_page('analysis')
    
    # 제품 추천 바로가기 위젯
    st.markdown(f"""
    


        

🛍️


        


            

맞춤 솔루션 추천


            

{ui['q1']}에 효과적인 제품들


        


    


    """, unsafe_allow_html=True)
    if st.button("추천 제품 보러가기", key="go_to_recommendation_btn"): set_page('recommendation')

    st.markdown("

", unsafe_allow_html=True)
    show_bottom_nav()

def calendar_page():
    st.markdown(f"

피부 달력

", unsafe_allow_html=True)
    st.markdown("

", unsafe_allow_html=True)
    now = datetime.now()
    st.write(f"### {now.year}년 {now.month}월")
    
    # 달력 표시 로직
    today_date = datetime.now().date()
    first_day_of_month = datetime(now.year, now.month, 1).date()
    # weekday()는 월요일=0, 일요일=6. 달력은 일요일부터 시작하므로 조정
    start_weekday = (first_day_of_month.weekday() + 1) % 7 
    
    if now.month == 12:
        days_in_month = (datetime(now.year + 1, 1, 1).date() - first_day_of_month).days
    else:
        days_in_month = (datetime(now.year, now.month + 1, 1).date() - first_day_of_month).days

    # 요일 헤더
    week_days = ['일', '월', '화', '수', '목', '금', '토']
    cols_header = st.columns(7)
    for i, day_name in enumerate(week_days):
        cols_header[i].markdown(f"

{day_name}

", unsafe_allow_html=True)

    day_counter = 1
    for week in range(6): # 최대 6주
        cols = st.columns(7)
        for i in range(7):
            if week == 0 and i < start_weekday:
                cols[i].write("") # 빈 칸
            elif day_counter <= days_in_month:
                current_day_date = datetime(now.year, now.month, day_counter).date()
                d_str = current_day_date.strftime("%Y-%m-%d")
                is_today = (current_day_date == today_date)
                has_record = (d_str in st.session_state.user_info['diary_records'])
                
                button_style = ""
                if is_today: button_style += f"background-color: {main_color} !important; color: white !important; border: 1px solid {main_color};"
                elif has_record: button_style += f"border: 2px solid {main_color};"
                
                button_label = f"

"
                button_label += f"{day_counter}
" if is_today else f"{day_counter}
"
                button_label += f"📍" if has_record else " "
                button_label += "

"

                if cols[i].button(f"{day_counter}", key=f"d_{d_str}", help="기록 보기" if has_record else "", use_container_width=True):
                    st.session_state.sel_date = d_str
                    st.rerun()
                
                cols[i].markdown(f"", unsafe_allow_html=True)
                cols[i].markdown(f"

{'' if is_today else ''}{day_counter}{'' if is_today else ''}
{'📍' if has_record else ' '}

", unsafe_allow_html=True)

                day_counter += 1
            else:
                cols[i].write("") # 빈 칸

    if 'sel_date' in st.session_state:
        sel = st.session_state.sel_date
        st.markdown(f"--- \n### 📅 {sel} 기록")
        if sel in st.session_state.user_info['diary_records']:
            rec = st.session_state.user_info['diary_records'][sel]
            if rec['img']:
                # Base64 이미지 디코딩 및 표시
                img_data = base64.b64decode(rec['img'])
                st.image(img_data, use_container_width=True)
            st.write(f"**🧴 사용 제품:** {', '.join(rec['products'])}")
            st.write(f"**📝 메모:** {rec['memo']}")
            st.write(f"**💯 피부 점수:** {rec['score']}점")
        else: st.info("기록이 없습니다.")
    st.markdown("

", unsafe_allow_html=True)
    show_bottom_nav()

def report_page():
    st.markdown(f"

분석 리포트

", unsafe_allow_html=True)
    st.markdown("

", unsafe_allow_html=True)
    ui = st.session_state.user_info

    if not ui['diary_records']:
        st.warning("데이터를 먼저 입력해주세요!")
    else:
        df = pd.DataFrame([{'date': k, 'score': v['score']} for k, v in ui['diary_records'].items()])
        df['date'] = pd.to_datetime(df['date'])
        df = df.sort_values(by='date')

        st.markdown("

📈 피부 점수 트렌드

", unsafe_allow_html=True)
        if PLOTLY_AVAILABLE:
            fig = px.line(df, x='date', y='score', title='일별 피부 점수 변화', markers=True)
            fig.update_layout(xaxis_title="날짜", yaxis_title="피부 점수", hovermode="x unified")
            st.plotly_chart(fig, use_container_width=True)
        else:
            st.line_chart(df.set_index('date'))
        st.markdown("

", unsafe_allow_html=True)

        st.markdown(f"

💡 AI 가이드

", unsafe_allow_html=True)
        # AI 가이드 로직 (예시)
        avg_score = df['score'].mean()
        guidance = f"{ui['name']}님, 현재 평균 피부 점수는 {avg_score:.1f}점입니다. "
        if ui['habits']['sleep'] < 7: guidance += "최근 수면 시간이 부족해요. 피부 회복을 위해 7시간 이상 숙면을 권장합니다! "
        if ui['habits']['water'] < 8: guidance += "물 섭취량을 늘려 피부 수분 공급에 신경 써주세요. "
        guidance += f"주요 고민인 '{ui['q1']}'에 대한 꾸준한 관리가 중요합니다."
        st.markdown(f"

{guidance}

", unsafe_allow_html=True)

    st.markdown("

", unsafe_allow_html=True)
    show_bottom_nav()

def community_page():
    st.markdown(f"

여치광장 (커뮤니티)

", unsafe_allow_html=True)
    st.markdown("

", unsafe_allow_html=True)
    ui = st.session_state.user_info

    with st.expander("📝 글쓰기"):
        post_content = st.text_area("피부 고민이나 팁을 공유해주세요!", key="post_in")
        if st.button("등록", key="post_submit_btn"):
            if post_content:
                ui['community_posts'].insert(0, {'user': ui['name'], 'content': post_content, 'likes': 0, 'comments': 0})
                st.success("게시글이 등록되었습니다!")
                st.rerun()
            else:
                st.warning("내용을 입력해주세요.")
    
    st.markdown("### 최신 게시글")
    if ui['community_posts']:
        for p in ui['community_posts']:
            st.markdown(f"

{p['user']}
{p['content']}
❤️ {p['likes']} 💬 {p['comments']}

", unsafe_allow_html=True)
    else:
        st.info("아직 게시글이 없습니다. 첫 게시글을 작성해보세요!")

    st.markdown("

", unsafe_allow_html=True)
    show_bottom_nav()

def expiry_page():
    st.markdown(f"

화장품 관리함

", unsafe_allow_html=True)
    st.markdown("

", unsafe_allow_html=True)
    ui = st.session_state.user_info

    with st.expander("💄 새 제품 등록"):
        name = st.text_input("제품명", key="exp_name")
        open_date = st.date_input("개봉일", datetime.now().date(), key="exp_date")
        months = st.number_input("사용 권장 기간(개월)", 1, 36, 12, key="exp_months")
        if st.button("등록하기", key="add_expiry_btn"):
            if name:
                ui['cosmetic_expiry'].append({'name': name, 'open_date': open_date, 'expiry_months': months})
                st.success("등록 완료!")
                st.rerun()
            else:
                st.warning("제품명을 입력해주세요.")
    
    st.markdown("### 등록된 제품")
    if ui['cosmetic_expiry']:
        for item in ui['cosmetic_expiry']:
            expiry_date = item['open_date'] + timedelta(days=item['expiry_months']*30)
            days_left = (expiry_date - datetime.now().date()).days
            
            status_text = ""
            if days_left < 0: status_text = f"기한 만료 ({abs(days_left)}일 지남)"
            elif days_left <= 30: status_text = f"만료 임박 ({days_left}일 남음)"
            else: status_text = f"{days_left}일 남음"

            st.markdown(f"

{item['name']}
남은 기간: {status_text}
개봉일: {item['open_date']} | 권장 기한: {expiry_date}

", unsafe_allow_html=True)
    else:
        st.info("등록된 화장품이 없습니다. 새 제품을 등록해보세요!")

    st.markdown("

", unsafe_allow_html=True)
    show_bottom_nav()

def analysis_page():
    st.markdown(f"

AI 피부 스캔

", unsafe_allow_html=True)
    st.markdown("

", unsafe_allow_html=True)
    
    st.markdown(f"""
    


        

스캔 가이드


        


            1. 밝은 곳에서 촬영해주세요.

            2. 패치가 정중앙에 오도록 맞춰주세요.

            3. 흔들리지 않게 주의해주세요.
        


    


    """, unsafe_allow_html=True)
    
    img = st.camera_input("패치 부착 부위 촬영")
    if img:
        with st.spinner("AI가 패치와 피부 상태를 정밀 분석 중입니다..."):
            time.sleep(3)
            score = random.randint(80, 98)
            st.success(f"분석 완료! 오늘의 피부 점수는 {score}점입니다.")
            st.markdown(f"""
            


                

📝 분석 리포트


                

패치 주변의 붉은기가 15% 감소했습니다.
수분도가 전일 대비 5% 상승했습니다.


            


            """, unsafe_allow_html=True)
            if st.button("홈으로 돌아가기", key="analysis_to_home"): set_page('home')
            
    st.markdown("

", unsafe_allow_html=True)
    show_bottom_nav()

def recommendation_page():
    st.markdown(f"

맞춤형 솔루션

", unsafe_allow_html=True)
    st.markdown("

", unsafe_allow_html=True)
    
    tabs = st.tabs(["💧 토너", "🧪 에센스", "💎 앰플", "🧴 크림", "🧼 클렌징"])
    for i, (cat, items) in enumerate(PRODUCT_DB.items()):
        with tabs[i]:
            for p in items:
                with st.expander(f"⭐ {p['score']} | {p['brand']} {p['name']}"):
                    st.markdown(f"

{p['price']}

", unsafe_allow_html=True)
                    st.markdown(f"

🍀 주요 성분: {p['ingredients']}

", unsafe_allow_html=True)
                    st.markdown(f"

✨ 기대 효과: {p['effect']}

", unsafe_allow_html=True)
                    st.markdown("

", unsafe_allow_html=True)
                    st.markdown("💬 리얼 리뷰:", unsafe_allow_html=True)
                    for r in p['reviews']:
                        st.markdown(f"

\"{r}\"

", unsafe_allow_html=True)
                    if st.button(f"{p['name']} 상세 정보/구매", key=f"buy_{p['name']}"):
                        st.success("공식 몰로 연결됩니다!")
    st.markdown("

", unsafe_allow_html=True)
    show_bottom_nav()

def mypage():
    st.markdown(f"

마이페이지

", unsafe_allow_html=True)
    st.markdown("

", unsafe_allow_html=True)
    ui = st.session_state.user_info
    
    # 프로필 섹션
    st.markdown("

", unsafe_allow_html=True)
    if ui['profile_pic']:
    
        img_data = base64.b64decode(ui['profile_pic'])
        st.image(img_data, width=120)
    else:
        st.markdown(f"

{ui['emoji']}

", unsafe_allow_html=True)
    
    pic_uploader = st.file_uploader("프로필 사진 변경", type=['jpg', 'png'], key="profile_uploader")
    if pic_uploader:
        ui['profile_pic'] = get_base64_image(pic_uploader)
        st.success("프로필 사진이 업데이트되었습니다!")
        st.rerun()
    st.markdown("

", unsafe_allow_html=True)
    
    # 정보 수정 폼 (상세 구현)
    with st.form("edit_profile_form_complex"):
        st.write("### 👤 개인 정보 수정")
        n = st.text_input("이름", value=ui['name'], key="mp_name_input")
        g = st.selectbox("성별", ["여성", "남성", "기타"], index=["여성", "남성", "기타"].index(ui['gender']), key="mp_gender_select")
        a = st.number_input("나이", 1, 100, ui['age'], key="mp_age_input")
        h = st.number_input("키 (cm)", 100, 220, ui['height'], key="mp_height_input")
        w = st.number_input("몸무게 (kg)", 30, 150, ui['weight'], key="mp_weight_input")
        
        st.write("### 🎨 테마 설정")
        e = st.text_input("이모지/특수문자", value=ui['emoji'], key="mp_emoji_input")
        c = st.color_picker("테마 컬러", value=ui['theme_color'], key="mp_color_picker")
        
        if st.form_submit_button("모든 변경사항 저장하기"):
            ui.update({
                'name': n, 'gender': g, 'age': a, 'height': h, 'weight': w,
                'emoji': e, 'theme_color': c
            })
            st.success("정보가 성공적으로 저장되었습니다!")
            time.sleep(0.5)
            st.rerun()
            
    # 갤러리 관리
    st.markdown("

", unsafe_allow_html=True)
    st.write("### 🖼️ 홈 화면 갤러리 관리")
    bf = st.file_uploader("새 이미지 추가", type=['jpg', 'png'], key="banner_uploader")
    sz = st.select_slider("표시 크기 (너비)", options=[100, 200, 300, 400], value=300, key="banner_size_slider")
    if st.button("홈 화면에 배치하기", key="add_banner_btn"):
        if bf:
            ui['custom_banners'].append({'file': get_base64_image(bf), 'size': sz})
            st.success("이미지가 홈 화면에 추가되었습니다!")
            st.rerun()
    if ui['custom_banners']:
        if st.button("모든 이미지 삭제", key="clear_banners_btn"):
            ui['custom_banners'] = []
            st.rerun()
    st.markdown("

", unsafe_allow_html=True)
    
    if st.button("로그아웃", key="logout_btn"):
        st.session_state.page = 'login'
        st.rerun()

    st.markdown("

", unsafe_allow_html=True)
    show_bottom_nav()

# ----------------- 라우팅 -----------------
pages = {
    'login': login_page,
    'signup': signup_page,
    'survey': survey_page,
    'home': home_page,
    'calendar': calendar_page,
    'report': report_page,
    'community': community_page,
    'expiry': expiry_page,
    'analysis': analysis_page,
    'recommendation': recommendation_page,
    'mypage': mypage
}
pages[st.session_state.page]() 우리는 이런 서비스를 창업하고있고 우리 MVP를 파이썬으로 만들어줘.  혹시 질문 있어?? 기본 적인 기능은, 먼저 회원가입-> 홈페이지 -> 설문조사/부가적인 기능. 설분조사에는 전날 뭘 먹었는지, 잠은 얼마나 잤는지 , 키/몸무게/성별/나이로  BMI검사를 하게 할거야. 그리고 우리 아이템이 여드름 분석 패치라서 그걸 인식하는 것도 홈페이지 중앙 아래에 만들어줘. 그리고 그 자신의 피부타입에 맞게 제품추천 하는 것도 만들어줘. 혹시 더 질문있어? 디자인은 좀 심플하면서 깔끔하면 좋겠어!!!! 피부에 여드름 나있는? 그런 사진도 몇개 추가하면 좋으럭 같고. 질문 더 있으면 개발 시작하기 전에 알려줘 1기술 스택은 프론트 엔드만 만들어줘. 그냥 HTML로 만들면 CSSㄷ 추가하는게 귀칞아서 파이썬으로 만들어달라고 하는거야 백앤드는 필요없어. 2.그냥 디자인적인것만 있어도 괜찮아. 카메라가 꼭 필요한건 아니지만 있으면 좋겠어 네가 만들수 있다면 추가해주고 만약 아직 네 능력이 그정도로 발전하지 못 했다면 그냥 이미지 인식하는 척만 하게해줘. 아니면 원래 파일에서 이미지를 업로드 하는 식으로 하거나. 네 능력이 가능한 곳까지 만들어줘. 아 제미나이는 만들었던데 네가 못하면 제미나이가 만든 코드 보내줄게!!! 3. 아니 그냥 기본적인 샘플 로직 만들어줘 내가 따로 추가할게 홈으로 가는 버튼을 추가해줘. 그리고 웹사이트 형식이 아니라 폰 디스플레이 형식으로 만들어줘 진짜 핸드폰 앱처럼!!우리 아이템 이름은 여치들이야. 이거 CLearskin말고 여치들로 바꿔줘. 그리고 이건 랜딩페이지가 아니라 MVP야 앱 소개 / 왜 여치들이어야 한가요 이런거 지워줘. 그리고 지금은 이미지도 없고 해서 웹사이트가 너무 재미없어. 뭐 크릭하거나 페이지 바뀔때 에니메이션을 추가해줘 지금은 너무 단순해. 그리고 메인 컬러는 오렌지를 사용해주는데 너무 촌스럽게 만들지는 말고 알잘딱깔센 뭔 말알?? 아니 그리고 맞춤형제품추천 익런것도 뭐 토너 스킨 에센스 이런걸로 분류하고 진짜 있는 제품으로 추가해줘. 자 스킨 차입을 배정받거나 선택하면 그거에 맞게 추천해주는거야 알겠지? 아 뒤로가기 버튼도 만들어줘. 지금은 디자인이 너무 구려 실제 이미지(AI생성이미지 불가능)도 많이 추가해주고 진짜 ㅇ배처럼 만들어줘. 네가 디자인을 정말 제미나이나 지피티보다 잘한다면 이미지를 추가할 필요는 없지만 네가 그정도 능력은 아닌거 같아서 그냥 예쁘게 만들어ㅜ저. 그리고 페이지 넘어갈떄/버튼 클릭했을떄 에니메이션 추가해서 더 재미있게 만들어줘 일단 디자인이 너무 구려 내가 만들어도 이것보다 잘 만들듯... 일단 내가 웹사이트가 아니라 앱처럼 만들어달라고 했잖아... 그리고 설문조사!!!!! 저거 디자인이 개구림 슬라이드 바 넘기는것도 더 둥글동글하게 만들어ㅜ저 그리고 첫 페이지 들어가면
🍊 ㅇ님, 안녕하세요!
오늘의 피부 컨디션은 어떤가요? 아래에 빈박스 2개가 있는데 이게 뭔지 알아와. 그리고 네가 만든 3가지 기능있잖아. (카메라 피부분석,제품추천 등등 )그걸 앱형식으로 만들고 아래에 슬라이드바 형식으로 만들어줘. 그리고 마이 페이지도 추가해줘. 여기에는 내 이름, 이메일, 나이 ,성별,키,피부타입++++++ 프로필사진 추가할 수 있게 만들어줘. 다시한번 강조하는데 웹사이트 형식이 아니라 스마트폰 앱 형식으로 만들어와 . 질문있어? 아니 화해처럼 앱으로 만들어달라고!!!!!!!! 아이거참나 -. 그리고 ㅇㅣ름 앞에 이모티콘 있는거 로그인할때 고르게 하고 마이페이지들어가서 수정할 수 있도록 만들어ㅜ저. 그리고!!!!! 저거 웹사이트 컬러가 지금은 오랜지인데 이모티콘과 동일하게 로그인할꺠 색상 5가지중에서 고르고 아니면 내가 원하는색 컬러넘버 입력하면 그걸로 할 수 있도록 해줘. 이것또한 마이페이지 들어가ㅓ 바꿀 수 있도록 해줘. 질문있어?? 아 그리고 디자인 지금 너무너무너무너무 구리니까 좀 핀터레스트에서 찾아보고 예쁘게 만들어줘 자금 디자인이 너무 구리고 앱도 재미가없어. 그리고 아무런 글자없이 빈박스만 있는게 있는데 그것들 다 지워줘 보기 불편해.질문있음???로그인 할때 테마컬러 장하기에서 색깔 바꾸면 그걸로 바로 바꿔서 무슨색인지 보이게 해줘.그리고 회원가입하면 강제적으로 설문조사하게 만들어서 그 정보를 바탕으로 마이페이지에 기입해줘. 만약 이미 회원가입을 하고 정보가 있는 사람이라면 그냥 홈페이지가 보이게해줘. 그리고 마이페이지 들어가서 이름,성별,나이,몸무게 수정할 수 있게 해줘. 그리고 우리 설문조사하는거 질문 5개? 정도 더 추가해줘.기존코드는 절대 수정하지 말고 내가 말하는 것만 추가해서 코드를 만들어줘. 일단 로그인/회원가입페이지.  일단 들어가면 로그인 페이지만 보이게 해줘(이ㅣ름 + 비밀번호). 그리고 아래로 내리면 회원가입하기, 비밀번호 찾기 를 만들어ㅜ저. 회원가입을 들어가면 이름+이메일+비밀번호+비밀번호 재확인 + 이모티코 선택(우리가 4개정도 선택지를 추고 별로면 사용자가 기입할 수 있도록 해줘. 특수문자도 가능하게!!) 그리고 컬로도 우리가 5개정도 제시하고 사용자가 1개 고를 수 있도록 해줘. 자 그리고 회우너가입후 강제적으로 설문조사로 넘어가는거 좋아. 근데 설문조사하는 페이지가 너무 구려. 버튼도 너무 올드하고!!!!! 좀 동글동글하게 만들어줘 ㅇ=그리고 클릭했을때 뭐 하트가 올라오거나 아니면 순간저긍로 커졌다 작아지는 이런 에니메이션도 추가해줘. 그리고 맞춤추천!!!!! 그거 내가 위에 에센스,토너,템플,킘,클렌징 이런식으로 카테고리별로 나눠달라고 했잖아 왜 지웠어 당장추가해!!!! 그리고 상품도 1개만 추천하지 말고 5개 이상 추천해줘. 거기에는 클릭시 성분+효과+다른 사람이 남긴 리뷰를 볼 수 있도록 추가해줘. 그리고 홈페이지에 분석 결과, 좁쌀 여드름 집중 케어가 필요해요.로 보이는데 그냥 __님 __피부타입이라 __여드름 케어가 필요해보여요! 이런식으로 적어줘. 내가 말한 기능들 추가만 하고 기존 코드들은 설대 삭제하지마. 이걸 삭제하지 않았을시 ㅇ류가 생기는 코드들만 수정해.아니 야 내가 기존기능 건들지 말라고 했지 로그인 페이지에 내 비번찾기 기능어디갔어 미친아!!!! 아니 그리고 로그인했을떄 계속 올라오는게 아니라!!!!! 설문조사에서 홈페이지로 이동할떄 짧게 올라오게 하라는 뜻 이었어 센스가 왤케 없냐!!!! 야 그리고 내가 회원이미지 빼지 말라도 했지!!! 프로필 사진도 다시 만들어와. 그리고 키 ,몸무게,나이,성별도 수정가능하게 하라고 했잖아 이거 빠진것들 다시 다 추가해와. 그릭 지금 홈페이지에 이미지 추가한게 너무 커!!! 작게 키우는 옵션도 추가해와.기존 코드는 하나도 건들지 말고~!!!! 내가 말한것만 추가해 알겠지?? 질문있어??더 구체적으로 만들어주면 좋겠어 지금 기능도 좋긴하지만 너무 AI같고 디자인이 별로야.그리고 이모티콘을 삭제하고 이름 앞에 내 프로필 사진이 보이도록 수정해줘. 그냥 내 이모티콘 고르기/수정하기 이런 기능 모두 삭제해줘. 그리고 나만의 피부갤러리도 이미지 업로드한 날짜랑 짧은 설명 + 사용한 제품 첨부하도록 만들어줘. 그리고 택 아래에 내 피부다이어리 이런식으로 해서 달력 추가해고, 거기 클릭하면 이미지+짧은 설명+사용한 제품 첨부하 수 있도록 코드 수정해줘.자, 이 코드에 보면 내가 홈페이지에 사진 업로드하면 내 피부 기록하기? 이런 페이지가 뜨잖아!!! 여기 이미지에 업로드한 날짜-사용한제품-짧은 메모 남길 수 있도록 추가해줘. 그럼 그 이미지+날짜+제품+메모 데이터가 생기겠지??? 그럼 아래에 달력탭을 추가해. 그리고 그 달력탭을 클릭하면 달력처럼 캘린더가 보이고,기존 입력했던 사진+메모+제품을 업로드한 날짜에 맞게 달력에 업로드하는식으로 만들어줘. 그리고 마이홈에서 업로드하느 사진은 꾸미기용,내 피부 기록하기는 기록용이야. 그래서 홈페이지에 있는 내 피부 기록하기에 업로드할 수 있는 +버튼 만들어서 클릭하면 이미지+제품+메모+날짜 남길 수 있도록 해줘. 기존코드는 절대절대 손대짐ㅏㄹ고 내가 말한 캘린더 기능만 수정해줘. 질문있어?마이 페이지에 로그아웃,탈퇴 버튼 만들어줘
내가꾸민 공간 텍스트 삭제 + 이미지 삭제기능
생활습관 기록하면 달력으로 기록되도록
피부중심->여드름 중심 키워드로 바꿔줘
여치광장-> 제품추천으로 변경 (에센스,토너,엠플,크림,클렌징등등 카테고리별 분류 5개 이상)
🖼️ 나만의 피부 갤러리 삭제
아래 버튼이 아닌 🏠
📅
📊
👥
💄
👤 탭들 삭제
기존 코드느 하나도 건들지 말고 내가 입력한 명령만 바꿔줘. 질문있어?

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://skin-patch-buddy.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/cf7fca40-9cff-4922-b79c-d4a20d438b65).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
