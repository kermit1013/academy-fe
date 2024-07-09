import  { useState } from 'react';
import main_logo from '../../public/groundi_logo.svg'
import text_logo from '../../public/groundi_text.svg'
import light_bulb from '../../public/light_bulb.svg'
import setting from '../../public/setting.svg'
import change_think from '../../public/change_think.svg'

const NavDrawer = () => {
    const [isExpanded, setIsExpanded] = useState(false);
  
    const menuItems = [
      { icon: '🧩', label: '自我探索' },
      { icon: <img src={light_bulb} alt="" />, label: '靈感發想' },
      { icon: <img src={change_think} alt="" />, label: '畫廊漫步' },
    ];
  
    const actionItems = [
      { icon: '✍️', label: '開始計畫' },
      { icon: '👥', label: '專案社群' },
    ];
  
    return (
      <div 
        className={`fixed top-0 left-0 h-full bg-gray-50 border-r border-gray-200 bg-opacity-30 shadow-lg transition-all duration-300 ease-in-out flex flex-col ${
          isExpanded ? 'w-48' : 'w-22'
        }`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className="p-4 flex-grow">
          <div className="flex items-center mb-6">
            <img src={main_logo} alt="Groundi" className="w-6 h-6 mr-2" />
            <img src={text_logo} alt="Groundi" className={`h-4 ${isExpanded ? 'block' : 'hidden'}`} />
          </div>
          <div className={`text-[#6CA579] text-xs font-medium mb-4 ${isExpanded ? 'block' : 'text-center'}`}>發想主題</div>
          {menuItems.map((item, index) => (
            <div key={index} className={`flex items-center mb-4 cursor-pointer group ${!isExpanded && 'justify-center'}`}>
              <span className="text-2xl text-gray-400 group-hover:text-[#6CA579]">{item.icon}</span>
              <span className={`ml-3 text-gray-600 text-sm group-hover:text-[#6CA579] ${isExpanded ? 'block' : 'hidden'}`}>
                {item.label}
              </span>
            </div>
          ))}
          <div className="border-t border-gray-200 my-4"></div>
          <div className={`text-[#6CA579] text-xs font-medium mb-4 ${isExpanded ? 'block' : 'text-center'}`}>執行計畫</div>
          {actionItems.map((item, index) => (
            <div key={index} className={`flex items-center mb-4 cursor-pointer group ${!isExpanded && 'justify-center'}`}>
              <span className="text-2xl text-gray-400 group-hover:text-[#6CA579]">{item.icon}</span>
              <span className={`ml-3 text-gray-600 text-sm group-hover:text-[#6CA579] ${isExpanded ? 'block' : 'hidden'}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
        <div className={`p-4 ${isExpanded ? 'pl-4' : 'text-center'}`}>
          <div className={`cursor-pointer group flex items-center ${!isExpanded && 'justify-center'}`}>
            <img src={setting} alt="" />
            <span className={`ml-3 text-gray-600 text-sm group-hover:text-green-600 ${isExpanded ? 'inline' : 'hidden'}`}>
              個人設定
            </span>
          </div>
        </div>
      </div>
    );
  };
  
  export default NavDrawer;